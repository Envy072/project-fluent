// Shared contract for the Learning Engine's HTTP surface (M18): Session
// Generation, Session Experience, and Progress. Types only — mirrors
// apps/api's response shapes so apps/web never redefines them.

export enum SessionState {
  GENERATED = 'GENERATED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ABANDONED = 'ABANDONED',
}

export enum SessionCompositionPartName {
  READING = 'READING',
  LISTENING = 'LISTENING',
  SPEAKING = 'SPEAKING',
  WRITING = 'WRITING',
  VOCABULARY = 'VOCABULARY',
  GRAMMAR = 'GRAMMAR',
  QUIZ = 'QUIZ',
}

export enum EngagementStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  REACHED_END = 'REACHED_END',
}

export enum TopicAssignmentScope {
  SESSION = 'SESSION',
  READING = 'READING',
  LISTENING = 'LISTENING',
  SPEAKING = 'SPEAKING',
  WRITING = 'WRITING',
  VOCABULARY = 'VOCABULARY',
  GRAMMAR = 'GRAMMAR',
  QUIZ = 'QUIZ',
}

export enum ProgressOutcome {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  INCOMPLETE = 'INCOMPLETE',
}

export interface TopicResponse {
  subjectMatter: string;
  assignmentScope: TopicAssignmentScope;
}

export interface SessionCompositionPartResponse {
  part: SessionCompositionPartName;
  content: string;
  engagementStatus: EngagementStatus;
}

export interface SessionResponse {
  id: string;
  state: SessionState;
  englishLevel: string;
  learningGoal: string;
  useOneTopicForAllSkills: boolean;
  topics: TopicResponse[];
  compositionParts: SessionCompositionPartResponse[];
  createdAt: string;
  updatedAt: string;
}

export type MostRecentOutcomeResponse =
  | { hasGeneratedSession: false }
  | { hasGeneratedSession: true; sessionId: string; outcome: ProgressOutcome };
