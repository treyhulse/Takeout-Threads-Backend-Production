/*
  Warnings:

  - The values [MANAGE] on the enum `ReportPermission` will be removed. If these variants are still used in the database, this will fail.
  - The values [FUNNEL,SCATTER_PLOT,HEATMAP,CUSTOM] on the enum `ReportType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `price` on the `Items` table. All the data in the column will be lost.
  - You are about to drop the column `variations` on the `Items` table. All the data in the column will be lost.
  - The `tags` column on the `Items` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `CartItems` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ItemPriceMatrices` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_VariationPriceMatrix` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[org_id,sku]` on the table `ItemVariation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `org_id` to the `ItemVariation` table without a default value. This is not possible if the table is not empty.
  - Made the column `price_level` on table `TransactionItems` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ReportPermission_new" AS ENUM ('VIEW', 'EDIT', 'ADMIN');
ALTER TABLE "ReportSharing" ALTER COLUMN "permissions" TYPE "ReportPermission_new" USING ("permissions"::text::"ReportPermission_new");
ALTER TABLE "DashboardSharing" ALTER COLUMN "permissions" TYPE "ReportPermission_new" USING ("permissions"::text::"ReportPermission_new");
ALTER TYPE "ReportPermission" RENAME TO "ReportPermission_old";
ALTER TYPE "ReportPermission_new" RENAME TO "ReportPermission";
DROP TYPE "ReportPermission_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ReportType_new" AS ENUM ('BAR_CHART', 'LINE_CHART', 'PIE_CHART', 'TABLE', 'KPI');
ALTER TABLE "AnalyticsReport" ALTER COLUMN "type" TYPE "ReportType_new" USING ("type"::text::"ReportType_new");
ALTER TYPE "ReportType" RENAME TO "ReportType_old";
ALTER TYPE "ReportType_new" RENAME TO "ReportType";
DROP TYPE "ReportType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "CartItems" DROP CONSTRAINT "CartItems_cart_id_fkey";

-- DropForeignKey
ALTER TABLE "CartItems" DROP CONSTRAINT "CartItems_item_id_fkey";

-- DropForeignKey
ALTER TABLE "CartItems" DROP CONSTRAINT "CartItems_matrix_id_fkey";

-- DropForeignKey
ALTER TABLE "ItemVariation" DROP CONSTRAINT "ItemVariation_item_id_fkey";

-- DropForeignKey
ALTER TABLE "PriceBreak" DROP CONSTRAINT "PriceBreak_matrix_id_fkey";

-- DropForeignKey
ALTER TABLE "PriceCell" DROP CONSTRAINT "PriceCell_break_id_fkey";

-- DropForeignKey
ALTER TABLE "PriceRule" DROP CONSTRAINT "PriceRule_matrix_id_fkey";

-- DropForeignKey
ALTER TABLE "TransactionItems" DROP CONSTRAINT "TransactionItems_item_id_fkey";

-- DropForeignKey
ALTER TABLE "TransactionItems" DROP CONSTRAINT "TransactionItems_transaction_id_fkey";

-- DropForeignKey
ALTER TABLE "_ItemPriceMatrices" DROP CONSTRAINT "_ItemPriceMatrices_A_fkey";

-- DropForeignKey
ALTER TABLE "_ItemPriceMatrices" DROP CONSTRAINT "_ItemPriceMatrices_B_fkey";

-- DropForeignKey
ALTER TABLE "_VariationPriceMatrix" DROP CONSTRAINT "_VariationPriceMatrix_A_fkey";

-- DropForeignKey
ALTER TABLE "_VariationPriceMatrix" DROP CONSTRAINT "_VariationPriceMatrix_B_fkey";

-- DropIndex
DROP INDEX "ItemVariation_item_id_sku_key";

-- DropIndex
DROP INDEX "PriceBreak_matrix_id_min_quantity_max_quantity_price_level_key";

-- DropIndex
DROP INDEX "PriceCell_break_id_complexity_key_key";

-- DropIndex
DROP INDEX "PriceMatrix_org_id_name_key";

-- DropIndex
DROP INDEX "PriceRule_matrix_id_condition_type_condition_value_key";

-- DropIndex
DROP INDEX "TransactionItems_transaction_id_item_id_key";

-- AlterTable
ALTER TABLE "ItemVariation" ADD COLUMN     "org_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Items" DROP COLUMN "price",
DROP COLUMN "variations",
DROP COLUMN "tags",
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "TransactionItems" ALTER COLUMN "price_level" SET NOT NULL;

-- DropTable
DROP TABLE "CartItems";

-- DropTable
DROP TABLE "_ItemPriceMatrices";

-- DropTable
DROP TABLE "_VariationPriceMatrix";

-- CreateTable
CREATE TABLE "CartItem" (
    "id" TEXT NOT NULL,
    "cart_id" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price_level" "PriceLevel" NOT NULL,
    "unit_price" DECIMAL(65,30) NOT NULL,
    "total" DECIMAL(65,30) NOT NULL,
    "matrix_id" TEXT,
    "complexity_values" JSONB,
    "markup_percent" DECIMAL(65,30),
    "base_price" DECIMAL(65,30),
    "production_cost" DECIMAL(65,30),

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ItemsToPriceMatrix" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ItemVariationToPriceMatrix" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ItemsToPriceMatrix_AB_unique" ON "_ItemsToPriceMatrix"("A", "B");

-- CreateIndex
CREATE INDEX "_ItemsToPriceMatrix_B_index" ON "_ItemsToPriceMatrix"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ItemVariationToPriceMatrix_AB_unique" ON "_ItemVariationToPriceMatrix"("A", "B");

-- CreateIndex
CREATE INDEX "_ItemVariationToPriceMatrix_B_index" ON "_ItemVariationToPriceMatrix"("B");

-- CreateIndex
CREATE UNIQUE INDEX "ItemVariation_org_id_sku_key" ON "ItemVariation"("org_id", "sku");

-- AddForeignKey
ALTER TABLE "TransactionItems" ADD CONSTRAINT "TransactionItems_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionItems" ADD CONSTRAINT "TransactionItems_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "Transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "Cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_matrix_id_fkey" FOREIGN KEY ("matrix_id") REFERENCES "PriceMatrix"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemVariation" ADD CONSTRAINT "ItemVariation_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceBreak" ADD CONSTRAINT "PriceBreak_matrix_id_fkey" FOREIGN KEY ("matrix_id") REFERENCES "PriceMatrix"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceCell" ADD CONSTRAINT "PriceCell_break_id_fkey" FOREIGN KEY ("break_id") REFERENCES "PriceBreak"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceRule" ADD CONSTRAINT "PriceRule_matrix_id_fkey" FOREIGN KEY ("matrix_id") REFERENCES "PriceMatrix"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemsToPriceMatrix" ADD CONSTRAINT "_ItemsToPriceMatrix_A_fkey" FOREIGN KEY ("A") REFERENCES "Items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemsToPriceMatrix" ADD CONSTRAINT "_ItemsToPriceMatrix_B_fkey" FOREIGN KEY ("B") REFERENCES "PriceMatrix"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemVariationToPriceMatrix" ADD CONSTRAINT "_ItemVariationToPriceMatrix_A_fkey" FOREIGN KEY ("A") REFERENCES "ItemVariation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemVariationToPriceMatrix" ADD CONSTRAINT "_ItemVariationToPriceMatrix_B_fkey" FOREIGN KEY ("B") REFERENCES "PriceMatrix"("id") ON DELETE CASCADE ON UPDATE CASCADE;
