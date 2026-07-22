import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { EnglishLevel, LearningGoal } from '../../../generated/prisma/client';

export class CreateLearningConfigurationDto {
  @IsEnum(EnglishLevel)
  englishLevel!: EnglishLevel;

  @IsEnum(LearningGoal)
  learningGoal!: LearningGoal;

  @IsOptional()
  @IsBoolean()
  useOneTopicForAllSkills?: boolean;
}
