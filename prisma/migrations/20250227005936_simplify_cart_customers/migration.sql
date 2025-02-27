/*
  Warnings:

  - You are about to drop the column `customer_id` on the `Cart` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_customer_id_fkey";

-- AlterTable
ALTER TABLE "Cart" DROP COLUMN "customer_id";
