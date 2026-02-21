-- Add workout/session timing fields to execution history
ALTER TABLE "exercise_executions"
ADD COLUMN "trackedDurationSeconds" INTEGER,
ADD COLUMN "totalDurationSeconds" INTEGER,
ADD COLUMN "workoutStartedAt" TIMESTAMP(3),
ADD COLUMN "workoutFinishedAt" TIMESTAMP(3);
