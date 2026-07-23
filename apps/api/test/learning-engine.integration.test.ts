import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { ValidationPipe, type INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { AiIntegrationService } from '../src/ai-integration/ai-integration.service';
import type {
  CompositionContentGenerationInput,
  GeneratedSessionComposition,
  GeneratedTopic,
  TopicGenerationInput,
} from '../src/ai-integration/ai-integration.types';

// Integration Verification (per M34's Testing Pyramid): confirms the
// Learning Engine (Session Generation, Session Experience, Progress
// Services, per M18) coordinates correctly end-to-end against a real
// PostgreSQL database. The AI Integration Module is stubbed rather than
// calling the real Anthropic API — Sprint 5 was explicitly scoped to build
// against a mock (see Sprint 4's precedent); this test exercises everything
// downstream of that boundary for real.

const USER_A_EMAIL = 'learning-engine-user-a@example.com';
const USER_B_EMAIL = 'learning-engine-user-b@example.com';
const PASSWORD = 'correct-horse-battery-staple';

const ALL_PARTS = [
  'reading',
  'listening',
  'speaking',
  'writing',
  'vocabulary',
  'grammar',
  'quiz',
] as const;

function buildFakeAiIntegrationService(): Pick<
  AiIntegrationService,
  'generateTopics' | 'generateCompositionContent'
> {
  return {
    generateTopics: vi.fn(async (input: TopicGenerationInput): Promise<GeneratedTopic[]> => {
      if (input.topicToggleEnabled) {
        return [{ subjectMatter: 'Coffee culture', assignmentScope: 'session' }];
      }
      return ALL_PARTS.map((part) => ({
        subjectMatter: `Topic for ${part}`,
        assignmentScope: part,
      }));
    }),
    generateCompositionContent: vi.fn(
      async (_input: CompositionContentGenerationInput): Promise<GeneratedSessionComposition> => ({
        reading: 'Reading content',
        listening: 'Listening content',
        speaking: 'Speaking content',
        writing: 'Writing content',
        vocabulary: 'Vocabulary content',
        grammar: 'Grammar content',
        quiz: 'Quiz content',
      }),
    ),
  };
}

describe('Learning Engine (integration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userAToken: string;
  let userBToken: string;

  beforeAll(async () => {
    process.env.AUTH_JWT_SECRET ??= 'integration-test-secret-do-not-use-in-production';
    process.env.ANTHROPIC_API_KEY ??= 'integration-test-anthropic-key-do-not-use-in-production';

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AiIntegrationService)
      .useValue(buildFakeAiIntegrationService())
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    );
    await app.init();

    prisma = moduleRef.get(PrismaService);
    await prisma.user.deleteMany({ where: { email: { in: [USER_A_EMAIL, USER_B_EMAIL] } } });

    const registerA = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: USER_A_EMAIL, password: PASSWORD })
      .expect(201);
    userAToken = registerA.body.accessToken;

    const registerB = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: USER_B_EMAIL, password: PASSWORD })
      .expect(201);
    userBToken = registerB.body.accessToken;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: { in: [USER_A_EMAIL, USER_B_EMAIL] } } });
    await app.close();
  });

  describe('unauthorized access', () => {
    it('rejects every operation without an access token', async () => {
      await request(app.getHttpServer()).post('/sessions').expect(401);
      await request(app.getHttpServer())
        .patch('/sessions/does-not-matter/parts/reading/engagement')
        .send({ status: 'REACHED_END' })
        .expect(401);
      await request(app.getHttpServer()).post('/sessions/does-not-matter/complete').expect(401);
      await request(app.getHttpServer()).post('/sessions/does-not-matter/abandon').expect(401);
      await request(app.getHttpServer()).get('/progress/latest').expect(401);
    });
  });

  describe('GenerateSession without a Learning Configuration', () => {
    it('fails when English Level and Learning Goal are not Configured', async () => {
      await request(app.getHttpServer())
        .post('/sessions')
        .set('Authorization', `Bearer ${userBToken}`)
        .expect(409);
    });
  });

  describe('GetMostRecentOutcome before any Session exists', () => {
    it('indicates no Session has ever been generated', async () => {
      const response = await request(app.getHttpServer())
        .get('/progress/latest')
        .set('Authorization', `Bearer ${userAToken}`)
        .expect(200);

      expect(response.body).toEqual({ hasGeneratedSession: false });
    });
  });

  describe('full lifecycle: generate, engage, complete', () => {
    let sessionId: string;

    it('configures the Learner (English Level, Learning Goal)', async () => {
      await request(app.getHttpServer())
        .post('/learning-configuration')
        .set('Authorization', `Bearer ${userAToken}`)
        .send({ englishLevel: 'B1', learningGoal: 'IELTS', useOneTopicForAllSkills: true })
        .expect(201);
    });

    it('generates a complete Session with all seven parts and one shared Topic', async () => {
      const response = await request(app.getHttpServer())
        .post('/sessions')
        .set('Authorization', `Bearer ${userAToken}`)
        .expect(201);

      sessionId = response.body.id;
      expect(response.body.state).toBe('IN_PROGRESS');
      expect(response.body.englishLevel).toBe('B1');
      expect(response.body.learningGoal).toBe('IELTS');
      expect(response.body.topics).toEqual([
        { subjectMatter: 'Coffee culture', assignmentScope: 'SESSION' },
      ]);
      expect(response.body.compositionParts).toHaveLength(7);
      for (const part of response.body.compositionParts) {
        expect(part.engagementStatus).toBe('NOT_STARTED');
        expect(typeof part.content).toBe('string');
      }
    });

    it('rejects generating a second Session while one is already In Progress', async () => {
      await request(app.getHttpServer())
        .post('/sessions')
        .set('Authorization', `Bearer ${userAToken}`)
        .expect(409);
    });

    it('creates a Pending Progress Record reflected by GetMostRecentOutcome', async () => {
      const response = await request(app.getHttpServer())
        .get('/progress/latest')
        .set('Authorization', `Bearer ${userAToken}`)
        .expect(200);

      expect(response.body).toEqual({
        hasGeneratedSession: true,
        sessionId,
        outcome: 'PENDING',
      });
    });

    it('rejects CompleteSession until all seven parts have Reached End', async () => {
      await request(app.getHttpServer())
        .post(`/sessions/${sessionId}/complete`)
        .set('Authorization', `Bearer ${userAToken}`)
        .expect(409);
    });

    it('records engagement for each part, moving through In Progress to Reached End', async () => {
      for (const part of ALL_PARTS) {
        const inProgress = await request(app.getHttpServer())
          .patch(`/sessions/${sessionId}/parts/${part.toUpperCase()}/engagement`)
          .set('Authorization', `Bearer ${userAToken}`)
          .send({ status: 'IN_PROGRESS' })
          .expect(200);
        expect(inProgress.body.engagementStatus).toBe('IN_PROGRESS');

        const reachedEnd = await request(app.getHttpServer())
          .patch(`/sessions/${sessionId}/parts/${part.toUpperCase()}/engagement`)
          .set('Authorization', `Bearer ${userAToken}`)
          .send({ status: 'REACHED_END' })
          .expect(200);
        expect(reachedEnd.body.engagementStatus).toBe('REACHED_END');
      }
    });

    it('rejects AbandonSession once all seven parts have Reached End', async () => {
      await request(app.getHttpServer())
        .post(`/sessions/${sessionId}/abandon`)
        .set('Authorization', `Bearer ${userAToken}`)
        .expect(409);
    });

    it('completes the Session now that every part has Reached End', async () => {
      await request(app.getHttpServer())
        .post(`/sessions/${sessionId}/complete`)
        .set('Authorization', `Bearer ${userAToken}`)
        .expect(204);
    });

    it('rejects further engagement once the Session is no longer In Progress', async () => {
      await request(app.getHttpServer())
        .patch(`/sessions/${sessionId}/parts/READING/engagement`)
        .set('Authorization', `Bearer ${userAToken}`)
        .send({ status: 'REACHED_END' })
        .expect(409);
    });

    it('reflects the Completed outcome via GetMostRecentOutcome', async () => {
      const response = await request(app.getHttpServer())
        .get('/progress/latest')
        .set('Authorization', `Bearer ${userAToken}`)
        .expect(200);

      expect(response.body).toEqual({ hasGeneratedSession: true, sessionId, outcome: 'COMPLETED' });
    });

    it('allows generating a new Session now that the previous one is no longer In Progress', async () => {
      await request(app.getHttpServer())
        .post('/sessions')
        .set('Authorization', `Bearer ${userAToken}`)
        .expect(201);
    });
  });

  describe('abandonment path', () => {
    it('marks the Session Abandoned and records an Incomplete outcome', async () => {
      const latest = await request(app.getHttpServer())
        .get('/progress/latest')
        .set('Authorization', `Bearer ${userAToken}`)
        .expect(200);
      const currentSessionId = latest.body.sessionId as string;

      await request(app.getHttpServer())
        .post(`/sessions/${currentSessionId}/abandon`)
        .set('Authorization', `Bearer ${userAToken}`)
        .expect(204);

      const afterAbandon = await request(app.getHttpServer())
        .get('/progress/latest')
        .set('Authorization', `Bearer ${userAToken}`)
        .expect(200);
      expect(afterAbandon.body).toEqual({
        hasGeneratedSession: true,
        sessionId: currentSessionId,
        outcome: 'INCOMPLETE',
      });
    });
  });

  describe('validation failures', () => {
    it('rejects an invalid Session Composition part name', async () => {
      await request(app.getHttpServer())
        .patch('/sessions/any-id/parts/NOT_A_REAL_PART/engagement')
        .set('Authorization', `Bearer ${userAToken}`)
        .send({ status: 'REACHED_END' })
        .expect(400);
    });

    it('rejects an invalid engagement status value', async () => {
      await request(app.getHttpServer())
        .patch('/sessions/any-id/parts/READING/engagement')
        .set('Authorization', `Bearer ${userAToken}`)
        .send({ status: 'NOT_A_REAL_STATUS' })
        .expect(400);
    });
  });

  describe('ownership isolation', () => {
    it("cannot act on another user's Session", async () => {
      await request(app.getHttpServer())
        .post('/learning-configuration')
        .set('Authorization', `Bearer ${userBToken}`)
        .send({ englishLevel: 'A1', learningGoal: 'TRAVEL', useOneTopicForAllSkills: false })
        .expect(201);

      const generated = await request(app.getHttpServer())
        .post('/sessions')
        .set('Authorization', `Bearer ${userBToken}`)
        .expect(201);
      const userBSessionId = generated.body.id as string;

      await request(app.getHttpServer())
        .patch(`/sessions/${userBSessionId}/parts/READING/engagement`)
        .set('Authorization', `Bearer ${userAToken}`)
        .send({ status: 'REACHED_END' })
        .expect(404);

      await request(app.getHttpServer())
        .post(`/sessions/${userBSessionId}/complete`)
        .set('Authorization', `Bearer ${userAToken}`)
        .expect(404);

      await request(app.getHttpServer())
        .post(`/sessions/${userBSessionId}/abandon`)
        .set('Authorization', `Bearer ${userAToken}`)
        .expect(404);
    });
  });
});
