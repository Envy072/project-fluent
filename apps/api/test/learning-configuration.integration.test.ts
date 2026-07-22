import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { ValidationPipe, type INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

// Integration Verification (per M34's Testing Pyramid): confirms the
// Learning Configuration Module's HTTP surface, service, and a real
// PostgreSQL database coordinate correctly end-to-end, including ownership
// isolation between two distinct Learners. Requires the docker-compose
// `postgres` service to be running locally.

const USER_A_EMAIL = 'learning-config-user-a@example.com';
const USER_B_EMAIL = 'learning-config-user-b@example.com';
const PASSWORD = 'correct-horse-battery-staple';

describe('Learning Configuration (integration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userAToken: string;
  let userBToken: string;

  beforeAll(async () => {
    process.env.AUTH_JWT_SECRET ??= 'integration-test-secret-do-not-use-in-production';

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

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
      await request(app.getHttpServer()).get('/learning-configuration').expect(401);
      await request(app.getHttpServer())
        .post('/learning-configuration')
        .send({ englishLevel: 'B1', learningGoal: 'IELTS' })
        .expect(401);
      await request(app.getHttpServer())
        .patch('/learning-configuration')
        .send({ englishLevel: 'C1' })
        .expect(401);
      await request(app.getHttpServer()).delete('/learning-configuration').expect(401);
    });
  });

  describe('before a configuration is created', () => {
    it('returns 404 for GET', async () => {
      await request(app.getHttpServer())
        .get('/learning-configuration')
        .set('Authorization', `Bearer ${userAToken}`)
        .expect(404);
    });
  });

  describe('validation failures', () => {
    it('rejects creation with an invalid English Level', async () => {
      await request(app.getHttpServer())
        .post('/learning-configuration')
        .set('Authorization', `Bearer ${userAToken}`)
        .send({ englishLevel: 'Z9', learningGoal: 'IELTS' })
        .expect(400);
    });

    it('rejects creation with an invalid Learning Goal', async () => {
      await request(app.getHttpServer())
        .post('/learning-configuration')
        .set('Authorization', `Bearer ${userAToken}`)
        .send({ englishLevel: 'B1', learningGoal: 'NOT_A_REAL_GOAL' })
        .expect(400);
    });

    it('rejects creation missing required fields', async () => {
      await request(app.getHttpServer())
        .post('/learning-configuration')
        .set('Authorization', `Bearer ${userAToken}`)
        .send({ englishLevel: 'B1' })
        .expect(400);
    });

    it('rejects payloads with unexpected fields', async () => {
      await request(app.getHttpServer())
        .post('/learning-configuration')
        .set('Authorization', `Bearer ${userAToken}`)
        .send({ englishLevel: 'B1', learningGoal: 'IELTS', dailyStudyMinutes: 30 })
        .expect(400);
    });
  });

  describe('create, read, update, delete lifecycle', () => {
    it('creates a configuration for the authenticated user', async () => {
      const response = await request(app.getHttpServer())
        .post('/learning-configuration')
        .set('Authorization', `Bearer ${userAToken}`)
        .send({ englishLevel: 'B1', learningGoal: 'IELTS' })
        .expect(201);

      expect(response.body).toMatchObject({
        englishLevel: 'B1',
        learningGoal: 'IELTS',
        useOneTopicForAllSkills: true,
      });
      expect(response.body).not.toHaveProperty('userId');
    });

    it('rejects a second creation for the same user', async () => {
      await request(app.getHttpServer())
        .post('/learning-configuration')
        .set('Authorization', `Bearer ${userAToken}`)
        .send({ englishLevel: 'A1', learningGoal: 'TRAVEL' })
        .expect(409);
    });

    it('reads back the created configuration', async () => {
      const response = await request(app.getHttpServer())
        .get('/learning-configuration')
        .set('Authorization', `Bearer ${userAToken}`)
        .expect(200);

      expect(response.body).toMatchObject({ englishLevel: 'B1', learningGoal: 'IELTS' });
    });

    it('updates only the fields provided', async () => {
      const response = await request(app.getHttpServer())
        .patch('/learning-configuration')
        .set('Authorization', `Bearer ${userAToken}`)
        .send({ englishLevel: 'C1' })
        .expect(200);

      expect(response.body).toMatchObject({
        englishLevel: 'C1',
        learningGoal: 'IELTS',
        useOneTopicForAllSkills: true,
      });
    });

    it('deletes the configuration', async () => {
      await request(app.getHttpServer())
        .delete('/learning-configuration')
        .set('Authorization', `Bearer ${userAToken}`)
        .expect(204);

      await request(app.getHttpServer())
        .get('/learning-configuration')
        .set('Authorization', `Bearer ${userAToken}`)
        .expect(404);
    });

    it('returns 404 when updating or deleting a configuration that no longer exists', async () => {
      await request(app.getHttpServer())
        .patch('/learning-configuration')
        .set('Authorization', `Bearer ${userAToken}`)
        .send({ englishLevel: 'A2' })
        .expect(404);

      await request(app.getHttpServer())
        .delete('/learning-configuration')
        .set('Authorization', `Bearer ${userAToken}`)
        .expect(404);
    });
  });

  describe('ownership isolation', () => {
    it("keeps each user's configuration independent and invisible to the other user", async () => {
      await request(app.getHttpServer())
        .post('/learning-configuration')
        .set('Authorization', `Bearer ${userAToken}`)
        .send({ englishLevel: 'B2', learningGoal: 'BUSINESS' })
        .expect(201);

      await request(app.getHttpServer())
        .post('/learning-configuration')
        .set('Authorization', `Bearer ${userBToken}`)
        .send({ englishLevel: 'A1', learningGoal: 'TRAVEL' })
        .expect(201);

      const asA = await request(app.getHttpServer())
        .get('/learning-configuration')
        .set('Authorization', `Bearer ${userAToken}`)
        .expect(200);
      expect(asA.body).toMatchObject({ englishLevel: 'B2', learningGoal: 'BUSINESS' });

      const asB = await request(app.getHttpServer())
        .get('/learning-configuration')
        .set('Authorization', `Bearer ${userBToken}`)
        .expect(200);
      expect(asB.body).toMatchObject({ englishLevel: 'A1', learningGoal: 'TRAVEL' });

      await request(app.getHttpServer())
        .patch('/learning-configuration')
        .set('Authorization', `Bearer ${userBToken}`)
        .send({ englishLevel: 'C2' })
        .expect(200);

      const asAAfterBUpdated = await request(app.getHttpServer())
        .get('/learning-configuration')
        .set('Authorization', `Bearer ${userAToken}`)
        .expect(200);
      expect(asAAfterBUpdated.body).toMatchObject({ englishLevel: 'B2' });

      await request(app.getHttpServer())
        .delete('/learning-configuration')
        .set('Authorization', `Bearer ${userBToken}`)
        .expect(204);

      const asAAfterBDeleted = await request(app.getHttpServer())
        .get('/learning-configuration')
        .set('Authorization', `Bearer ${userAToken}`)
        .expect(200);
      expect(asAAfterBDeleted.body).toMatchObject({ englishLevel: 'B2' });
    });
  });
});
