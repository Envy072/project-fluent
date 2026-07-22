import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ConfigService } from '@nestjs/config';
import type Anthropic from '@anthropic-ai/sdk';
import { AiIntegrationService } from '../src/ai-integration/ai-integration.service';
import { AiGenerationFailedException } from '../src/ai-integration/ai-integration.exceptions';
import { EnglishLevel, LearningGoal } from '../generated/prisma/client';

function buildClientMock(toolName: string, toolInput: unknown) {
  return {
    messages: {
      create: vi.fn().mockResolvedValue({
        id: 'msg_1',
        content: [
          {
            type: 'tool_use',
            id: 'tool_1',
            name: toolName,
            input: toolInput,
            caller: { type: 'direct' },
          },
        ],
      }),
    },
  } as unknown as Anthropic;
}

function buildConfigServiceMock(overrides: Record<string, string> = {}) {
  return {
    get: vi.fn((key: string) => overrides[key]),
  } as unknown as ConfigService;
}

describe('AiIntegrationService', () => {
  let config: ReturnType<typeof buildConfigServiceMock>;

  beforeEach(() => {
    config = buildConfigServiceMock();
  });

  describe('generateTopics', () => {
    it('returns exactly one session-scoped Topic when the toggle is enabled', async () => {
      const client = buildClientMock('provide_topics', {
        topics: [{ subjectMatter: 'Coffee culture', assignmentScope: 'session' }],
      });
      const service = new AiIntegrationService(client, config);

      const result = await service.generateTopics({
        englishLevel: EnglishLevel.B1,
        learningGoal: LearningGoal.GENERAL_ENGLISH,
        topicToggleEnabled: true,
      });

      expect(result).toEqual([{ subjectMatter: 'Coffee culture', assignmentScope: 'session' }]);
      expect(client.messages.create).toHaveBeenCalledWith(
        expect.objectContaining({
          tool_choice: { type: 'tool', name: 'provide_topics' },
        }),
      );
    });

    it('rejects an Enabled-toggle response with more than one Topic', async () => {
      const client = buildClientMock('provide_topics', {
        topics: [
          { subjectMatter: 'Coffee culture', assignmentScope: 'session' },
          { subjectMatter: 'Travel', assignmentScope: 'reading' },
        ],
      });
      const service = new AiIntegrationService(client, config);

      await expect(
        service.generateTopics({
          englishLevel: EnglishLevel.B1,
          learningGoal: LearningGoal.GENERAL_ENGLISH,
          topicToggleEnabled: true,
        }),
      ).rejects.toBeInstanceOf(AiGenerationFailedException);
    });

    it('rejects an Enabled-toggle response whose single Topic is not session-scoped', async () => {
      const client = buildClientMock('provide_topics', {
        topics: [{ subjectMatter: 'Coffee culture', assignmentScope: 'reading' }],
      });
      const service = new AiIntegrationService(client, config);

      await expect(
        service.generateTopics({
          englishLevel: EnglishLevel.B1,
          learningGoal: LearningGoal.GENERAL_ENGLISH,
          topicToggleEnabled: true,
        }),
      ).rejects.toBeInstanceOf(AiGenerationFailedException);
    });

    it('returns distinct, part-scoped Topics when the toggle is disabled', async () => {
      const client = buildClientMock('provide_topics', {
        topics: [
          { subjectMatter: 'Coffee culture', assignmentScope: 'reading' },
          { subjectMatter: 'Air travel', assignmentScope: 'listening' },
        ],
      });
      const service = new AiIntegrationService(client, config);

      const result = await service.generateTopics({
        englishLevel: EnglishLevel.B1,
        learningGoal: LearningGoal.GENERAL_ENGLISH,
        topicToggleEnabled: false,
      });

      expect(result).toHaveLength(2);
    });

    it('rejects a Disabled-toggle response containing a session-scoped Topic', async () => {
      const client = buildClientMock('provide_topics', {
        topics: [{ subjectMatter: 'Coffee culture', assignmentScope: 'session' }],
      });
      const service = new AiIntegrationService(client, config);

      await expect(
        service.generateTopics({
          englishLevel: EnglishLevel.B1,
          learningGoal: LearningGoal.GENERAL_ENGLISH,
          topicToggleEnabled: false,
        }),
      ).rejects.toBeInstanceOf(AiGenerationFailedException);
    });

    it('rejects a Disabled-toggle response with duplicate part scopes', async () => {
      const client = buildClientMock('provide_topics', {
        topics: [
          { subjectMatter: 'Coffee culture', assignmentScope: 'reading' },
          { subjectMatter: 'Air travel', assignmentScope: 'reading' },
        ],
      });
      const service = new AiIntegrationService(client, config);

      await expect(
        service.generateTopics({
          englishLevel: EnglishLevel.B1,
          learningGoal: LearningGoal.GENERAL_ENGLISH,
          topicToggleEnabled: false,
        }),
      ).rejects.toBeInstanceOf(AiGenerationFailedException);
    });

    it('rejects a response with no Topics at all', async () => {
      const client = buildClientMock('provide_topics', { topics: [] });
      const service = new AiIntegrationService(client, config);

      await expect(
        service.generateTopics({
          englishLevel: EnglishLevel.B1,
          learningGoal: LearningGoal.GENERAL_ENGLISH,
          topicToggleEnabled: true,
        }),
      ).rejects.toBeInstanceOf(AiGenerationFailedException);
    });
  });

  describe('generateCompositionContent', () => {
    const allParts = {
      reading: 'Reading content',
      listening: 'Listening content',
      speaking: 'Speaking content',
      writing: 'Writing content',
      vocabulary: 'Vocabulary content',
      grammar: 'Grammar content',
      quiz: 'Quiz content',
    };

    it('returns content for all seven parts when the AI Layer provides them all', async () => {
      const client = buildClientMock('provide_session_composition', allParts);
      const service = new AiIntegrationService(client, config);

      const result = await service.generateCompositionContent({
        englishLevel: EnglishLevel.B1,
        learningGoal: LearningGoal.GENERAL_ENGLISH,
        topics: [{ subjectMatter: 'Coffee culture', assignmentScope: 'session' }],
      });

      expect(result).toEqual(allParts);
      expect(client.messages.create).toHaveBeenCalledWith(
        expect.objectContaining({
          tool_choice: { type: 'tool', name: 'provide_session_composition' },
        }),
      );
    });

    it('rejects a response missing one of the seven parts', async () => {
      const { quiz: _quiz, ...missingQuiz } = allParts;
      const client = buildClientMock('provide_session_composition', missingQuiz);
      const service = new AiIntegrationService(client, config);

      await expect(
        service.generateCompositionContent({
          englishLevel: EnglishLevel.B1,
          learningGoal: LearningGoal.GENERAL_ENGLISH,
          topics: [{ subjectMatter: 'Coffee culture', assignmentScope: 'session' }],
        }),
      ).rejects.toBeInstanceOf(AiGenerationFailedException);
    });

    it('rejects a response where a part is present but empty', async () => {
      const client = buildClientMock('provide_session_composition', { ...allParts, quiz: '   ' });
      const service = new AiIntegrationService(client, config);

      await expect(
        service.generateCompositionContent({
          englishLevel: EnglishLevel.B1,
          learningGoal: LearningGoal.GENERAL_ENGLISH,
          topics: [{ subjectMatter: 'Coffee culture', assignmentScope: 'session' }],
        }),
      ).rejects.toBeInstanceOf(AiGenerationFailedException);
    });
  });

  describe('model selection', () => {
    it('uses ANTHROPIC_MODEL from configuration when set', async () => {
      const client = buildClientMock('provide_topics', {
        topics: [{ subjectMatter: 'Coffee culture', assignmentScope: 'session' }],
      });
      const configuredModel = buildConfigServiceMock({ ANTHROPIC_MODEL: 'claude-custom-model' });
      const service = new AiIntegrationService(client, configuredModel);

      await service.generateTopics({
        englishLevel: EnglishLevel.B1,
        learningGoal: LearningGoal.GENERAL_ENGLISH,
        topicToggleEnabled: true,
      });

      expect(client.messages.create).toHaveBeenCalledWith(
        expect.objectContaining({ model: 'claude-custom-model' }),
      );
    });

    it('falls back to a default model when ANTHROPIC_MODEL is unset', async () => {
      const client = buildClientMock('provide_topics', {
        topics: [{ subjectMatter: 'Coffee culture', assignmentScope: 'session' }],
      });
      const service = new AiIntegrationService(client, config);

      await service.generateTopics({
        englishLevel: EnglishLevel.B1,
        learningGoal: LearningGoal.GENERAL_ENGLISH,
        topicToggleEnabled: true,
      });

      const call = vi.mocked(client.messages.create).mock.calls[0]![0] as { model: string };
      expect(typeof call.model).toBe('string');
      expect(call.model.length).toBeGreaterThan(0);
    });
  });
});
