/*
  Warnings:

  - You are about to drop the `items` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TransactionItems" DROP CONSTRAINT "TransactionItems_item_id_fkey";

-- DropTable
DROP TABLE "items";

-- CreateTable
CREATE TABLE "Items" (
    "id" TEXT NOT NULL,
    "org_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sku" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "variations" JSONB,
    "price" DECIMAL(65,30),
    "global_identifier" TEXT,
    "status" "ItemStatus" NOT NULL DEFAULT 'DRAFT',
    "metadata" JSONB,
    "notes" TEXT,
    "unit_of_measure" TEXT NOT NULL,
    "weight" DECIMAL(65,30),
    "weight_unit" "WeightUnit",
    "length" DECIMAL(65,30),
    "length_unit" "DimensionUnit",
    "width" DECIMAL(65,30),
    "width_unit" "DimensionUnit",
    "depth" DECIMAL(65,30),
    "depth_unit" "DimensionUnit",
    "tags" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "front_image_url" TEXT,
    "back_image_url" TEXT,
    "images" JSONB,

    CONSTRAINT "Items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Items_org_id_sku_key" ON "Items"("org_id", "sku");

-- AddForeignKey
ALTER TABLE "TransactionItems" ADD CONSTRAINT "TransactionItems_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
