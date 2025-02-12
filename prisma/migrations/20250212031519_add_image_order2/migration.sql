-- DropForeignKey
ALTER TABLE "TransactionItems" DROP CONSTRAINT "TransactionItems_item_id_fkey";

-- DropForeignKey
ALTER TABLE "TransactionItems" DROP CONSTRAINT "TransactionItems_transaction_id_fkey";

-- AddForeignKey
ALTER TABLE "TransactionItems" ADD CONSTRAINT "TransactionItems_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "Transactions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionItems" ADD CONSTRAINT "TransactionItems_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
