/*
  Warnings:

  - The `price_level` column on the `TransactionItems` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `price_level` to the `CartItems` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PriceLevel" AS ENUM ('RETAIL', 'WHOLESALE', 'DISTRIBUTOR', 'CUSTOM');

-- AlterEnum
ALTER TYPE "ReportPermission" ADD VALUE 'ADMIN';

-- AlterTable
ALTER TABLE "CartItems" ADD COLUMN     "base_price" DECIMAL(65,30),
ADD COLUMN     "complexity_values" JSONB,
ADD COLUMN     "markup_percent" DECIMAL(65,30),
ADD COLUMN     "matrix_id" TEXT,
ADD COLUMN     "price_level" "PriceLevel" NOT NULL,
ADD COLUMN     "production_cost" DECIMAL(65,30);

-- AlterTable
ALTER TABLE "Items" ADD COLUMN     "base_price" DECIMAL(65,30),
ADD COLUMN     "default_matrix_id" TEXT;

-- AlterTable
ALTER TABLE "TransactionItems" ADD COLUMN     "base_price" DECIMAL(65,30),
ADD COLUMN     "complexity_values" JSONB,
ADD COLUMN     "markup_percent" DECIMAL(65,30),
ADD COLUMN     "matrix_id" TEXT,
ADD COLUMN     "production_cost" DECIMAL(65,30),
DROP COLUMN "price_level",
ADD COLUMN     "price_level" "PriceLevel";

-- CreateTable
CREATE TABLE "ItemVariation" (
    "id" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "attributes" JSONB NOT NULL,
    "price_adjustment" DECIMAL(65,30),
    "inventory_quantity" INTEGER NOT NULL DEFAULT 0,
    "low_stock_alert" INTEGER,
    "status" "ItemStatus" NOT NULL DEFAULT 'DRAFT',
    "weight" DECIMAL(65,30),
    "weight_unit" "WeightUnit",
    "length" DECIMAL(65,30),
    "length_unit" "DimensionUnit",
    "width" DECIMAL(65,30),
    "width_unit" "DimensionUnit",
    "depth" DECIMAL(65,30),
    "depth_unit" "DimensionUnit",
    "images" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ItemVariation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PriceMatrix" (
    "id" TEXT NOT NULL,
    "org_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "is_template" BOOLEAN NOT NULL DEFAULT false,
    "is_global" BOOLEAN NOT NULL DEFAULT false,
    "complexity_factor" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PriceMatrix_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PriceBreak" (
    "id" TEXT NOT NULL,
    "matrix_id" TEXT NOT NULL,
    "min_quantity" INTEGER NOT NULL,
    "max_quantity" INTEGER NOT NULL,
    "markup_percent" DECIMAL(65,30) NOT NULL,
    "base_price" DECIMAL(65,30),
    "complexity_values" JSONB NOT NULL,
    "price_level" "PriceLevel" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PriceBreak_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PriceCell" (
    "id" TEXT NOT NULL,
    "break_id" TEXT NOT NULL,
    "complexity_key" TEXT NOT NULL,
    "production_cost" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PriceCell_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PriceRule" (
    "id" TEXT NOT NULL,
    "matrix_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "condition_type" TEXT NOT NULL,
    "condition_value" TEXT NOT NULL,
    "adjustment_type" TEXT NOT NULL,
    "adjustment_value" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PriceRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ItemPriceMatrices" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_VariationPriceMatrix" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ItemVariation_item_id_sku_key" ON "ItemVariation"("item_id", "sku");

-- CreateIndex
CREATE UNIQUE INDEX "PriceMatrix_org_id_name_key" ON "PriceMatrix"("org_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "PriceBreak_matrix_id_min_quantity_max_quantity_price_level_key" ON "PriceBreak"("matrix_id", "min_quantity", "max_quantity", "price_level");

-- CreateIndex
CREATE UNIQUE INDEX "PriceCell_break_id_complexity_key_key" ON "PriceCell"("break_id", "complexity_key");

-- CreateIndex
CREATE UNIQUE INDEX "PriceRule_matrix_id_condition_type_condition_value_key" ON "PriceRule"("matrix_id", "condition_type", "condition_value");

-- CreateIndex
CREATE UNIQUE INDEX "_ItemPriceMatrices_AB_unique" ON "_ItemPriceMatrices"("A", "B");

-- CreateIndex
CREATE INDEX "_ItemPriceMatrices_B_index" ON "_ItemPriceMatrices"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_VariationPriceMatrix_AB_unique" ON "_VariationPriceMatrix"("A", "B");

-- CreateIndex
CREATE INDEX "_VariationPriceMatrix_B_index" ON "_VariationPriceMatrix"("B");

-- AddForeignKey
ALTER TABLE "Items" ADD CONSTRAINT "Items_default_matrix_id_fkey" FOREIGN KEY ("default_matrix_id") REFERENCES "PriceMatrix"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionItems" ADD CONSTRAINT "TransactionItems_matrix_id_fkey" FOREIGN KEY ("matrix_id") REFERENCES "PriceMatrix"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItems" ADD CONSTRAINT "CartItems_matrix_id_fkey" FOREIGN KEY ("matrix_id") REFERENCES "PriceMatrix"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemVariation" ADD CONSTRAINT "ItemVariation_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceBreak" ADD CONSTRAINT "PriceBreak_matrix_id_fkey" FOREIGN KEY ("matrix_id") REFERENCES "PriceMatrix"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceCell" ADD CONSTRAINT "PriceCell_break_id_fkey" FOREIGN KEY ("break_id") REFERENCES "PriceBreak"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceRule" ADD CONSTRAINT "PriceRule_matrix_id_fkey" FOREIGN KEY ("matrix_id") REFERENCES "PriceMatrix"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemPriceMatrices" ADD CONSTRAINT "_ItemPriceMatrices_A_fkey" FOREIGN KEY ("A") REFERENCES "Items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemPriceMatrices" ADD CONSTRAINT "_ItemPriceMatrices_B_fkey" FOREIGN KEY ("B") REFERENCES "PriceMatrix"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VariationPriceMatrix" ADD CONSTRAINT "_VariationPriceMatrix_A_fkey" FOREIGN KEY ("A") REFERENCES "ItemVariation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VariationPriceMatrix" ADD CONSTRAINT "_VariationPriceMatrix_B_fkey" FOREIGN KEY ("B") REFERENCES "PriceMatrix"("id") ON DELETE CASCADE ON UPDATE CASCADE;
