// Shared contract for the Learning Configuration domain (M09): the exact
// three fields Version 1 defines — English Level, Learning Goal, and Topic
// Toggle Preference ("No more, no fewer"). Types only — no runtime code, no
// business logic beyond what M09 documents.

export enum EnglishLevel {
  A1 = 'A1',
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1',
  C2 = 'C2',
}

export enum LearningGoal {
  GENERAL_ENGLISH = 'GENERAL_ENGLISH',
  IELTS = 'IELTS',
  BUSINESS = 'BUSINESS',
  TRAVEL = 'TRAVEL',
  UNIVERSITY = 'UNIVERSITY',
  JOB_INTERVIEWS = 'JOB_INTERVIEWS',
}

export interface LearningConfigurationResponse {
  id: string;
  englishLevel: EnglishLevel;
  learningGoal: LearningGoal;
  useOneTopicForAllSkills: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLearningConfigurationRequest {
  englishLevel: EnglishLevel;
  learningGoal: LearningGoal;
  useOneTopicForAllSkills?: boolean;
}

export interface UpdateLearningConfigurationRequest {
  englishLevel?: EnglishLevel;
  learningGoal?: LearningGoal;
  useOneTopicForAllSkills?: boolean;
}
