-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'PARTIALLY_PAID', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CREDIT_CARD', 'BANK_TRANSFER', 'CASH', 'CHECK', 'OTHER');

-- AlterTable
ALTER TABLE "Transactions" ADD COLUMN     "billing_address_id" TEXT,
ADD COLUMN     "payment_method" "PaymentMethod",
ADD COLUMN     "payment_status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "shipping_address_id" TEXT,
ADD COLUMN     "shipping_cost" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "tax_amount" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "total_amount" DECIMAL(65,30) NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_billing_address_id_fkey" FOREIGN KEY ("billing_address_id") REFERENCES "Addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_shipping_address_id_fkey" FOREIGN KEY ("shipping_address_id") REFERENCES "Addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
