-- CreateEnum
CREATE TYPE "SessionState" AS ENUM ('GENERATED', 'IN_PROGRESS', 'COMPLETED', 'ABANDONED');

-- CreateEnum
CREATE TYPE "SessionCompositionPartName" AS ENUM ('READING', 'LISTENING', 'SPEAKING', 'WRITING', 'VOCABULARY', 'GRAMMAR', 'QUIZ');

-- CreateEnum
CREATE TYPE "EngagementStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'REACHED_END');

-- CreateEnum
CREATE TYPE "TopicAssignmentScope" AS ENUM ('SESSION', 'READING', 'LISTENING', 'SPEAKING', 'WRITING', 'VOCABULARY', 'GRAMMAR', 'QUIZ');

-- CreateEnum
CREATE TYPE "ProgressOutcome" AS ENUM ('PENDING', 'COMPLETED', 'INCOMPLETE');

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "englishLevel" "EnglishLevel" NOT NULL,
    "learningGoal" "LearningGoal" NOT NULL,
    "useOneTopicForAllSkills" BOOLEAN NOT NULL,
    "state" "SessionState" NOT NULL DEFAULT 'IN_PROGRESS',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "topics" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "subjectMatter" TEXT NOT NULL,
    "assignmentScope" "TopicAssignmentScope" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_composition_parts" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "part" "SessionCompositionPartName" NOT NULL,
    "content" TEXT NOT NULL,
    "engagementStatus" "EngagementStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "session_composition_parts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "progress_records" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "outcome" "ProgressOutcome" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "progress_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "session_composition_parts_sessionId_part_key" ON "session_composition_parts"("sessionId", "part");

-- CreateIndex
CREATE UNIQUE INDEX "progress_records_sessionId_key" ON "progress_records"("sessionId");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topics" ADD CONSTRAINT "topics_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_composition_parts" ADD CONSTRAINT "session_composition_parts_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progress_records" ADD CONSTRAINT "progress_records_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
