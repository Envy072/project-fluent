-- CreateEnum
CREATE TYPE "EnglishLevel" AS ENUM ('A1', 'A2', 'B1', 'B2', 'C1', 'C2');

-- CreateEnum
CREATE TYPE "LearningGoal" AS ENUM ('GENERAL_ENGLISH', 'IELTS', 'BUSINESS', 'TRAVEL', 'UNIVERSITY', 'JOB_INTERVIEWS');

-- CreateTable
CREATE TABLE "learning_configurations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "englishLevel" "EnglishLevel" NOT NULL,
    "learningGoal" "LearningGoal" NOT NULL,
    "useOneTopicForAllSkills" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "learning_configurations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "learning_configurations_userId_key" ON "learning_configurations"("userId");

-- AddForeignKey
ALTER TABLE "learning_configurations" ADD CONSTRAINT "learning_configurations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
