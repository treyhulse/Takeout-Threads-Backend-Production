/*
  Warnings:

  - You are about to drop the column `coordinates` on the `Addresses` table. All the data in the column will be lost.
  - You are about to drop the column `valid` on the `Addresses` table. All the data in the column will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Site` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('SALE', 'QUOTE', 'PURCHASE', 'RETURN', 'INVOICE', 'SUBSCRIPTION', 'CREDIT', 'REFUND', 'TRANSFER', 'JOB', 'ADJUSTMENT');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'APPROVED', 'COMPLETED', 'CANCELED');

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_siteId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_userId_fkey";

-- DropForeignKey
ALTER TABLE "Site" DROP CONSTRAINT "Site_userId_fkey";

-- AlterTable
ALTER TABLE "Addresses" DROP COLUMN "coordinates",
DROP COLUMN "valid",
ADD COLUMN     "company" TEXT,
ADD COLUMN     "easypost_id" TEXT,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "Site";

-- CreateTable
CREATE TABLE "Parcels" (
    "id" TEXT NOT NULL,
    "org_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "length" DECIMAL(65,30) NOT NULL,
    "length_unit" "DimensionUnit" NOT NULL,
    "width" DECIMAL(65,30) NOT NULL,
    "width_unit" "DimensionUnit" NOT NULL,
    "depth" DECIMAL(65,30) NOT NULL,
    "depth_unit" "DimensionUnit" NOT NULL,
    "weight" DECIMAL(65,30) NOT NULL,
    "weight_unit" "WeightUnit" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Parcels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Locations" (
    "id" TEXT NOT NULL,
    "org_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "address_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transactions" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "org_id" TEXT NOT NULL,
    "entity_id" TEXT,
    "type" "TransactionType" NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "total" DECIMAL(65,30) NOT NULL,
    "tax" DECIMAL(65,30),
    "shipping" DECIMAL(65,30),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionItems" (
    "id" TEXT NOT NULL,
    "transaction_id" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price_level" TEXT,
    "unit_price" DECIMAL(65,30) NOT NULL,
    "discount" DECIMAL(65,30),
    "total" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "TransactionItems_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Parcels_org_id_id_key" ON "Parcels"("org_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "Locations_org_id_id_key" ON "Locations"("org_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "Transactions_org_id_number_key" ON "Transactions"("org_id", "number");

-- CreateIndex
CREATE UNIQUE INDEX "TransactionItems_transaction_id_item_id_key" ON "TransactionItems"("transaction_id", "item_id");

-- AddForeignKey
ALTER TABLE "Locations" ADD CONSTRAINT "Locations_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "Addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "Customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionItems" ADD CONSTRAINT "TransactionItems_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "Transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionItems" ADD CONSTRAINT "TransactionItems_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
