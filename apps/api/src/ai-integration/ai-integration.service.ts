import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type Anthropic from '@anthropic-ai/sdk';
import { ANTHROPIC_CLIENT } from './anthropic-client.provider';
import { AiGenerationFailedException } from './ai-integration.exceptions';
import {
  SESSION_COMPOSITION_PARTS,
  type CompositionContentGenerationInput,
  type GeneratedSessionComposition,
  type GeneratedTopic,
  type TopicGenerationInput,
} from './ai-integration.types';

const DEFAULT_MODEL = 'claude-sonnet-4-5-20250929';

const LEARNING_GOAL_FRAMING: Record<string, string> = {
  GENERAL_ENGLISH: 'everyday, general-purpose material',
  IELTS: 'IELTS-style material',
  BUSINESS: 'workplace scenarios',
  TRAVEL: 'practical travel scenarios',
  UNIVERSITY: 'academic contexts',
  JOB_INTERVIEWS: 'job interview scenarios',
};

const PROVIDE_TOPICS_TOOL: Anthropic.Tool = {
  name: 'provide_topics',
  description: "Provide the generated Topic(s) for a Learner's Session.",
  input_schema: {
    type: 'object',
    properties: {
      topics: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            subjectMatter: { type: 'string' },
            assignmentScope: {
              type: 'string',
              enum: ['session', ...SESSION_COMPOSITION_PARTS],
            },
          },
          required: ['subjectMatter', 'assignmentScope'],
        },
      },
    },
    required: ['topics'],
  },
};

const PROVIDE_SESSION_COMPOSITION_TOOL: Anthropic.Tool = {
  name: 'provide_session_composition',
  description: 'Provide the content for all seven Session Composition parts.',
  input_schema: {
    type: 'object',
    properties: Object.fromEntries(
      SESSION_COMPOSITION_PARTS.map((part) => [part, { type: 'string' }]),
    ),
    required: [...SESSION_COMPOSITION_PARTS],
  },
};

/**
 * Realizes M21's AI Integration Module: the two AI Interaction Points
 * (Topic Generation, Composition Content Generation), invoked exclusively
 * by the future Session Generation Service — never exposed over HTTP, per
 * M21's "never directly reachable by any other subsystem" boundary.
 *
 * Receives only the AI Input Concepts M21 defines and returns only the AI
 * Output Concepts it defines; never partial output — a response that
 * cannot be parsed into a complete result throws instead of returning it,
 * per M21's Failure Handling Principles.
 */
@Injectable()
export class AiIntegrationService {
  private readonly model: string;

  constructor(
    @Inject(ANTHROPIC_CLIENT) private readonly client: Anthropic,
    config: ConfigService,
  ) {
    this.model = config.get<string>('ANTHROPIC_MODEL') ?? DEFAULT_MODEL;
  }

  /** Topic Generation (M21): produces one Topic (Enabled) or one per part (Disabled). */
  async generateTopics(input: TopicGenerationInput): Promise<GeneratedTopic[]> {
    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 1024,
      system:
        'You generate Topics for an English learning Session. Respond only by calling the provided tool.',
      messages: [{ role: 'user', content: this.buildTopicGenerationPrompt(input) }],
      tools: [PROVIDE_TOPICS_TOOL],
      tool_choice: { type: 'tool', name: PROVIDE_TOPICS_TOOL.name },
    });

    const result = this.extractToolInput<{ topics?: GeneratedTopic[] }>(
      response,
      PROVIDE_TOPICS_TOOL.name,
    );
    const topics = result?.topics;

    if (!topics || topics.length === 0) {
      throw new AiGenerationFailedException('The AI Layer did not return any Topics.');
    }

    if (input.topicToggleEnabled) {
      if (topics.length !== 1 || topics[0]?.assignmentScope !== 'session') {
        throw new AiGenerationFailedException(
          'Topic Toggle Preference is Enabled but the AI Layer did not return exactly one session-scoped Topic.',
        );
      }
    } else {
      const scopes = topics.map((topic) => topic.assignmentScope);
      const uniqueScopes = new Set(scopes);
      if (scopes.includes('session') || uniqueScopes.size !== scopes.length) {
        throw new AiGenerationFailedException(
          'Topic Toggle Preference is Disabled but the AI Layer did not return distinct, part-scoped Topics.',
        );
      }
    }

    return topics;
  }

  /** Composition Content Generation (M21): produces content for all seven parts. */
  async generateCompositionContent(
    input: CompositionContentGenerationInput,
  ): Promise<GeneratedSessionComposition> {
    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 4096,
      system:
        'You generate the content of a Session Composition part for an English learning Session. Respond only by calling the provided tool.',
      messages: [{ role: 'user', content: this.buildCompositionContentPrompt(input) }],
      tools: [PROVIDE_SESSION_COMPOSITION_TOOL],
      tool_choice: { type: 'tool', name: PROVIDE_SESSION_COMPOSITION_TOOL.name },
    });

    const result = this.extractToolInput<Partial<GeneratedSessionComposition>>(
      response,
      PROVIDE_SESSION_COMPOSITION_TOOL.name,
    );

    for (const part of SESSION_COMPOSITION_PARTS) {
      const content = result?.[part];
      if (!content || content.trim().length === 0) {
        throw new AiGenerationFailedException(
          `The AI Layer did not return content for the "${part}" Session Composition part.`,
        );
      }
    }

    return result as GeneratedSessionComposition;
  }

  private buildTopicGenerationPrompt(input: TopicGenerationInput): string {
    const goalFraming = LEARNING_GOAL_FRAMING[input.learningGoal] ?? input.learningGoal;
    const toggleInstruction = input.topicToggleEnabled
      ? 'Produce exactly one Topic, scoped to "session", shared across the entire Session.'
      : `Produce exactly one Topic per Session Composition part (${SESSION_COMPOSITION_PARTS.join(', ')}), each scoped to its own part.`;

    return [
      `English Level: ${input.englishLevel}`,
      `Learning Goal: ${input.learningGoal} (favor ${goalFraming})`,
      toggleInstruction,
    ].join('\n');
  }

  private buildCompositionContentPrompt(input: CompositionContentGenerationInput): string {
    const goalFraming = LEARNING_GOAL_FRAMING[input.learningGoal] ?? input.learningGoal;
    const topicLines = input.topics.map(
      (topic) => `- "${topic.subjectMatter}" (applies to: ${topic.assignmentScope})`,
    );

    return [
      `English Level: ${input.englishLevel} (all content must match this difficulty)`,
      `Learning Goal: ${input.learningGoal} (favor ${goalFraming})`,
      'Topics:',
      ...topicLines,
      `Produce content for all seven Session Composition parts: ${SESSION_COMPOSITION_PARTS.join(', ')}.`,
      'Each part must be built around the Topic assigned to it (or the shared session Topic).',
    ].join('\n');
  }

  private extractToolInput<T>(response: Anthropic.Message, toolName: string): T | undefined {
    const block = response.content.find(
      (item): item is Anthropic.ToolUseBlock => item.type === 'tool_use' && item.name === toolName,
    );
    return block?.input as T | undefined;
  }
}
