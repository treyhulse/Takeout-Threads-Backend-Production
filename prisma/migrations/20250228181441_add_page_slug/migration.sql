/*
  Warnings:

  - A unique constraint covering the columns `[store_id,slug]` on the table `Page` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Page" ADD COLUMN     "slug" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "Page_store_id_slug_key" ON "Page"("store_id", "slug");
