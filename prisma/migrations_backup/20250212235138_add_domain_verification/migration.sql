-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "domain_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "verification_code" TEXT;
