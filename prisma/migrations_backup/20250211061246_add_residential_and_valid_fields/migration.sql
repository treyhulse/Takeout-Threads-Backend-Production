-- CreateEnum
CREATE TYPE "AddressValidationStatus" AS ENUM ('VALID', 'INVALID', 'PENDING');

-- AlterTable
ALTER TABLE "Addresses" ADD COLUMN     "residential" BOOLEAN,
ADD COLUMN     "valid" "AddressValidationStatus" NOT NULL DEFAULT 'PENDING';
