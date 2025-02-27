/*
  Warnings:

  - You are about to drop the column `billing_address_id` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `checkout_session_id` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `discount_id` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `discount_total` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `expires_at` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `shipping_address_id` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `shipping_cost` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `tax_amount` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `total_amount` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `total_weight` on the `Cart` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_billing_address_id_fkey";

-- DropForeignKey
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_discount_id_fkey";

-- DropForeignKey
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_shipping_address_id_fkey";

-- AlterTable
ALTER TABLE "Cart" DROP COLUMN "billing_address_id",
DROP COLUMN "checkout_session_id",
DROP COLUMN "discount_id",
DROP COLUMN "discount_total",
DROP COLUMN "expires_at",
DROP COLUMN "shipping_address_id",
DROP COLUMN "shipping_cost",
DROP COLUMN "tax_amount",
DROP COLUMN "total_amount",
DROP COLUMN "total_weight";
