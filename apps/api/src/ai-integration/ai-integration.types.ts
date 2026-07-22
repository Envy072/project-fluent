import type { EnglishLevel, LearningGoal } from '../../generated/prisma/client';

/**
 * The seven Session Composition parts (M08's Session Composition) — fixed
 * and exhaustive; no part may be added, omitted, or substituted.
 */
export const SESSION_COMPOSITION_PARTS = [
  'reading',
  'listening',
  'speaking',
  'writing',
  'vocabulary',
  'grammar',
  'quiz',
] as const;

export type SessionCompositionPart = (typeof SESSION_COMPOSITION_PARTS)[number];

/** Topic Generation's input (M21's AI Input Concepts). */
export interface TopicGenerationInput {
  englishLevel: EnglishLevel;
  learningGoal: LearningGoal;
  topicToggleEnabled: boolean;
}

/**
 * A generated Topic (M17's Topic object): its subject matter, and whether
 * it applies to the whole Session or to one specific Composition part —
 * determined by the Topic Toggle Preference in effect at generation.
 */
export interface GeneratedTopic {
  subjectMatter: string;
  assignmentScope: 'session' | SessionCompositionPart;
}

/** Composition Content Generation's input (M21's AI Input Concepts). */
export interface CompositionContentGenerationInput {
  englishLevel: EnglishLevel;
  learningGoal: LearningGoal;
  topics: GeneratedTopic[];
}

/** Content for all seven Session Composition parts (M21's AI Output Concepts). */
export type GeneratedSessionComposition = Record<SessionCompositionPart, string>;
