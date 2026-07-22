import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { EnglishLevel, LearningGoal } from '../../../generated/prisma/client';

export class UpdateLearningConfigurationDto {
  @IsOptional()
  @IsEnum(EnglishLevel)
  englishLevel?: EnglishLevel;

  @IsOptional()
  @IsEnum(LearningGoal)
  learningGoal?: LearningGoal;

  @IsOptional()
  @IsBoolean()
  useOneTopicForAllSkills?: boolean;
}
