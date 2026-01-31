/*
  Warnings:

  - Added the required column `teacherId` to the `students` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable - Primeiro adiciona a coluna como opcional
ALTER TABLE "students" ADD COLUMN "teacherId" TEXT;

-- Atribui o primeiro professor para todos os alunos existentes
UPDATE "students" 
SET "teacherId" = (SELECT id FROM "teachers" LIMIT 1)
WHERE "teacherId" IS NULL;

-- Agora torna a coluna obrigatória
ALTER TABLE "students" ALTER COLUMN "teacherId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "teachers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
