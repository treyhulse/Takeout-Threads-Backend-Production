/*
  Warnings:

  - You are about to drop the `Item` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Item";

-- CreateTable
CREATE TABLE "Items" (
    "id" TEXT NOT NULL,
    "org_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sku" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "variations" JSONB,
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

    CONSTRAINT "Items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customers" (
    "id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "org_id" TEXT NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "company_name" TEXT,
    "email" TEXT NOT NULL,
    "alt_email" TEXT,
    "phone" TEXT,
    "alt_phone" TEXT,
    "account_rep" TEXT,
    "comments" TEXT,
    "last_order_date" TIMESTAMP(3),
    "customer_category" TEXT,
    "notes" TEXT,
    "default_shipping_address" TEXT,
    "default_billing_address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Addresses" (
    "id" TEXT NOT NULL,
    "address_id" TEXT NOT NULL,
    "org_id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "street1" TEXT NOT NULL,
    "street2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "name" TEXT,
    "valid" BOOLEAN NOT NULL DEFAULT true,
    "coordinates" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Addresses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Items_org_id_sku_key" ON "Items"("org_id", "sku");

-- CreateIndex
CREATE UNIQUE INDEX "Customers_org_id_customer_id_key" ON "Customers"("org_id", "customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "Addresses_address_id_key" ON "Addresses"("address_id");

-- CreateIndex
CREATE UNIQUE INDEX "Addresses_org_id_address_id_key" ON "Addresses"("org_id", "address_id");

-- AddForeignKey
ALTER TABLE "Customers" ADD CONSTRAINT "Customers_default_shipping_address_fkey" FOREIGN KEY ("default_shipping_address") REFERENCES "Addresses"("address_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customers" ADD CONSTRAINT "Customers_default_billing_address_fkey" FOREIGN KEY ("default_billing_address") REFERENCES "Addresses"("address_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Addresses" ADD CONSTRAINT "Addresses_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
