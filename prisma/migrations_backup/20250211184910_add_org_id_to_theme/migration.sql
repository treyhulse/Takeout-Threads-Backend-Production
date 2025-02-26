/*
  Warnings:

  - Added the required column `org_id` to the `Theme` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Theme" ADD COLUMN     "org_id" TEXT NOT NULL;
