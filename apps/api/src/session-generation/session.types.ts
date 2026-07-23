import type {
  EngagementStatus,
  EnglishLevel,
  LearningGoal,
  SessionCompositionPartName,
  SessionState,
  TopicAssignmentScope,
} from '../../generated/prisma/client';

export interface TopicResponse {
  subjectMatter: string;
  assignmentScope: TopicAssignmentScope;
}

export interface SessionCompositionPartResponse {
  part: SessionCompositionPartName;
  content: string;
  engagementStatus: EngagementStatus;
}

/** A complete Session (M08): its generating values, Topic(s), and all seven Session Composition parts. */
export interface SessionResponse {
  id: string;
  state: SessionState;
  englishLevel: EnglishLevel;
  learningGoal: LearningGoal;
  useOneTopicForAllSkills: boolean;
  topics: TopicResponse[];
  compositionParts: SessionCompositionPartResponse[];
  createdAt: Date;
  updatedAt: Date;
}
