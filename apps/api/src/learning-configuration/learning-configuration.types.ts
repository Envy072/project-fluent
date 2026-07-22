import type { EnglishLevel, LearningGoal } from '../../generated/prisma/client';

export interface LearningConfigurationResponse {
  id: string;
  englishLevel: EnglishLevel;
  learningGoal: LearningGoal;
  useOneTopicForAllSkills: boolean;
  createdAt: Date;
  updatedAt: Date;
}
