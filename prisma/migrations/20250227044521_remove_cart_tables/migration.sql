/*
  Warnings:

  - You are about to drop the `Cart` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CartItems` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CartItems" DROP CONSTRAINT "CartItems_cart_id_fkey";

-- DropForeignKey
ALTER TABLE "CartItems" DROP CONSTRAINT "CartItems_item_id_fkey";

-- DropTable
DROP TABLE "Cart";

-- DropTable
DROP TABLE "CartItems";

-- DropEnum
DROP TYPE "CartStatus";
