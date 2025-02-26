-- CreateEnum
CREATE TYPE "ItemStatus" AS ENUM ('ACTIVE', 'DRAFT', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "WeightUnit" AS ENUM ('OUNCE', 'POUND');

-- CreateEnum
CREATE TYPE "DimensionUnit" AS ENUM ('INCH', 'CENTIMETER', 'FOOT');

-- CreateEnum
CREATE TYPE "AddressValidationStatus" AS ENUM ('VALID', 'INVALID', 'PENDING');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('SALE', 'QUOTE', 'PURCHASE', 'RETURN', 'INVOICE', 'SUBSCRIPTION', 'CREDIT', 'REFUND', 'TRANSFER', 'JOB', 'ADJUSTMENT');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'APPROVED', 'COMPLETED', 'CANCELED');

-- CreateEnum
CREATE TYPE "EmailStatus" AS ENUM ('SENT', 'DELIVERED', 'FAILED', 'OPENED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'PARTIALLY_PAID', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CREDIT_CARD', 'BANK_TRANSFER', 'CASH', 'CHECK', 'OTHER');

-- CreateEnum
CREATE TYPE "CartStatus" AS ENUM ('ACTIVE', 'CHECKOUT_IN_PROGRESS', 'CONVERTED', 'ABANDONED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "ShipmentStatus" AS ENUM ('PENDING', 'PROCESSING', 'PACKED', 'SHIPPED', 'DELIVERED', 'RETURNED');

-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('PERCENTAGE', 'FIXED_AMOUNT', 'FREE_SHIPPING');

-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('BAR_CHART', 'LINE_CHART', 'PIE_CHART', 'TABLE', 'KPI', 'FUNNEL', 'SCATTER_PLOT', 'HEATMAP', 'CUSTOM');

-- CreateEnum
CREATE TYPE "ReportPermission" AS ENUM ('VIEW', 'EDIT', 'ADMIN', 'MANAGE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "profileImage" TEXT NOT NULL,
    "customerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "stripeSubscriptionId" TEXT NOT NULL,
    "interval" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "currentPeriodStart" INTEGER NOT NULL,
    "currentPeriodEnd" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("stripeSubscriptionId")
);

-- CreateTable
CREATE TABLE "Items" (
    "id" TEXT NOT NULL,
    "org_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sku" TEXT NOT NULL,
    "type" TEXT NOT NULL,
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
    "inventory_quantity" INTEGER NOT NULL DEFAULT 0,
    "low_stock_alert" INTEGER,

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
    "easypost_id" TEXT,
    "name" TEXT,
    "company" TEXT,
    "street1" TEXT NOT NULL,
    "street2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "valid" "AddressValidationStatus" NOT NULL DEFAULT 'PENDING',
    "residential" BOOLEAN,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Addresses_pkey" PRIMARY KEY ("id")
);

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
    "tax_amount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "shipping_cost" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "discount_total" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "total_amount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "payment_status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "payment_method" "PaymentMethod",
    "shipping_method" TEXT,
    "estimated_ship_date" TIMESTAMP(3),
    "actual_ship_date" TIMESTAMP(3),
    "billing_address_id" TEXT,
    "shipping_address_id" TEXT,
    "discount_id" TEXT,
    "tax" DECIMAL(65,30),
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

-- CreateTable
CREATE TABLE "Store" (
    "store_id" TEXT NOT NULL,
    "org_id" TEXT NOT NULL,
    "theme_id" TEXT,
    "store_logo_url" TEXT,
    "slogan" TEXT,
    "name" TEXT NOT NULL,
    "subdomain" TEXT NOT NULL,
    "domain" TEXT,
    "domain_verified" BOOLEAN NOT NULL DEFAULT false,
    "verification_code" TEXT,
    "timezone" TEXT,
    "metadata" JSONB,

    CONSTRAINT "Store_pkey" PRIMARY KEY ("store_id")
);

-- CreateTable
CREATE TABLE "Page" (
    "page_id" TEXT NOT NULL,
    "store_id" TEXT NOT NULL,
    "org_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("page_id")
);

-- CreateTable
CREATE TABLE "Component" (
    "component_id" TEXT NOT NULL,
    "org_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "Component_pkey" PRIMARY KEY ("component_id")
);

-- CreateTable
CREATE TABLE "Theme" (
    "theme_id" TEXT NOT NULL,
    "org_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "Theme_pkey" PRIMARY KEY ("theme_id")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "org_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailMessage" (
    "id" TEXT NOT NULL,
    "resendId" TEXT,
    "conversationId" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" "EmailStatus" NOT NULL DEFAULT 'SENT',
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "org_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "EmailMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cart" (
    "id" TEXT NOT NULL,
    "org_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "customer_id" TEXT,
    "status" "CartStatus" NOT NULL DEFAULT 'ACTIVE',
    "total" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "tax_amount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "shipping_cost" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "discount_total" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "total_amount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "total_weight" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "billing_address_id" TEXT,
    "shipping_address_id" TEXT,
    "checkout_session_id" TEXT,
    "discount_id" TEXT,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CartItems" (
    "id" TEXT NOT NULL,
    "cart_id" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" DECIMAL(65,30) NOT NULL,
    "total" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "CartItems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shipment" (
    "id" TEXT NOT NULL,
    "transaction_id" TEXT NOT NULL,
    "carrier" TEXT NOT NULL,
    "tracking_number" TEXT NOT NULL,
    "status" "ShipmentStatus" NOT NULL DEFAULT 'PENDING',
    "shipped_at" TIMESTAMP(3),
    "delivered_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Shipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Discount" (
    "id" TEXT NOT NULL,
    "org_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" "DiscountType" NOT NULL,
    "value" DECIMAL(65,30) NOT NULL,
    "starts_at" TIMESTAMP(3) NOT NULL,
    "ends_at" TIMESTAMP(3),
    "usage_limit" INTEGER,
    "times_used" INTEGER NOT NULL DEFAULT 0,
    "minimum_amount" DECIMAL(65,30),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Discount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryMovement" (
    "id" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "quantity_change" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "reference_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InventoryMovement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalyticsReport" (
    "id" TEXT NOT NULL,
    "org_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "ReportType" NOT NULL,
    "config" JSONB NOT NULL,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "is_favorite" BOOLEAN NOT NULL DEFAULT false,
    "last_run_at" TIMESTAMP(3),
    "schedule" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnalyticsReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dashboard" (
    "id" TEXT NOT NULL,
    "org_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "layout" JSONB NOT NULL,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "is_favorite" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dashboard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DashboardReports" (
    "id" TEXT NOT NULL,
    "dashboard_id" TEXT NOT NULL,
    "report_id" TEXT NOT NULL,
    "position" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DashboardReports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportSharing" (
    "id" TEXT NOT NULL,
    "report_id" TEXT NOT NULL,
    "shared_with" TEXT NOT NULL,
    "permissions" "ReportPermission" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReportSharing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DashboardSharing" (
    "id" TEXT NOT NULL,
    "dashboard_id" TEXT NOT NULL,
    "shared_with" TEXT NOT NULL,
    "permissions" "ReportPermission" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DashboardSharing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_customerId_key" ON "User"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_stripeSubscriptionId_key" ON "Subscription"("stripeSubscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userId_key" ON "Subscription"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Items_org_id_sku_key" ON "Items"("org_id", "sku");

-- CreateIndex
CREATE UNIQUE INDEX "Customers_org_id_customer_id_key" ON "Customers"("org_id", "customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "Addresses_address_id_key" ON "Addresses"("address_id");

-- CreateIndex
CREATE UNIQUE INDEX "Addresses_org_id_address_id_key" ON "Addresses"("org_id", "address_id");

-- CreateIndex
CREATE UNIQUE INDEX "Parcels_org_id_id_key" ON "Parcels"("org_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "Locations_org_id_id_key" ON "Locations"("org_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "Transactions_org_id_number_key" ON "Transactions"("org_id", "number");

-- CreateIndex
CREATE UNIQUE INDEX "TransactionItems_transaction_id_item_id_key" ON "TransactionItems"("transaction_id", "item_id");

-- CreateIndex
CREATE UNIQUE INDEX "Store_subdomain_key" ON "Store"("subdomain");

-- CreateIndex
CREATE INDEX "Conversation_org_id_idx" ON "Conversation"("org_id");

-- CreateIndex
CREATE INDEX "Conversation_user_id_idx" ON "Conversation"("user_id");

-- CreateIndex
CREATE INDEX "EmailMessage_conversationId_idx" ON "EmailMessage"("conversationId");

-- CreateIndex
CREATE INDEX "EmailMessage_org_id_idx" ON "EmailMessage"("org_id");

-- CreateIndex
CREATE INDEX "EmailMessage_user_id_idx" ON "EmailMessage"("user_id");

-- CreateIndex
CREATE INDEX "EmailMessage_resendId_idx" ON "EmailMessage"("resendId");

-- CreateIndex
CREATE UNIQUE INDEX "Cart_org_id_id_key" ON "Cart"("org_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "CartItems_cart_id_item_id_key" ON "CartItems"("cart_id", "item_id");

-- CreateIndex
CREATE UNIQUE INDEX "Discount_org_id_code_key" ON "Discount"("org_id", "code");

-- CreateIndex
CREATE UNIQUE INDEX "AnalyticsReport_org_id_name_key" ON "AnalyticsReport"("org_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Dashboard_org_id_name_key" ON "Dashboard"("org_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "DashboardReports_dashboard_id_report_id_key" ON "DashboardReports"("dashboard_id", "report_id");

-- CreateIndex
CREATE UNIQUE INDEX "ReportSharing_report_id_shared_with_key" ON "ReportSharing"("report_id", "shared_with");

-- CreateIndex
CREATE UNIQUE INDEX "DashboardSharing_dashboard_id_shared_with_key" ON "DashboardSharing"("dashboard_id", "shared_with");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customers" ADD CONSTRAINT "Customers_default_shipping_address_fkey" FOREIGN KEY ("default_shipping_address") REFERENCES "Addresses"("address_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customers" ADD CONSTRAINT "Customers_default_billing_address_fkey" FOREIGN KEY ("default_billing_address") REFERENCES "Addresses"("address_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Addresses" ADD CONSTRAINT "Addresses_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Locations" ADD CONSTRAINT "Locations_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "Addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "Customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_billing_address_id_fkey" FOREIGN KEY ("billing_address_id") REFERENCES "Addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_shipping_address_id_fkey" FOREIGN KEY ("shipping_address_id") REFERENCES "Addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_discount_id_fkey" FOREIGN KEY ("discount_id") REFERENCES "Discount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionItems" ADD CONSTRAINT "TransactionItems_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "Transactions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionItems" ADD CONSTRAINT "TransactionItems_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Store" ADD CONSTRAINT "Store_theme_id_fkey" FOREIGN KEY ("theme_id") REFERENCES "Theme"("theme_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "Store"("store_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailMessage" ADD CONSTRAINT "EmailMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_billing_address_id_fkey" FOREIGN KEY ("billing_address_id") REFERENCES "Addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_shipping_address_id_fkey" FOREIGN KEY ("shipping_address_id") REFERENCES "Addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_discount_id_fkey" FOREIGN KEY ("discount_id") REFERENCES "Discount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItems" ADD CONSTRAINT "CartItems_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItems" ADD CONSTRAINT "CartItems_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "Transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryMovement" ADD CONSTRAINT "InventoryMovement_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DashboardReports" ADD CONSTRAINT "DashboardReports_dashboard_id_fkey" FOREIGN KEY ("dashboard_id") REFERENCES "Dashboard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DashboardReports" ADD CONSTRAINT "DashboardReports_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "AnalyticsReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportSharing" ADD CONSTRAINT "ReportSharing_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "AnalyticsReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DashboardSharing" ADD CONSTRAINT "DashboardSharing_dashboard_id_fkey" FOREIGN KEY ("dashboard_id") REFERENCES "Dashboard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
