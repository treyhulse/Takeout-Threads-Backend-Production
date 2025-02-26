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
    "name" TEXT NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "Theme_pkey" PRIMARY KEY ("theme_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Store_subdomain_key" ON "Store"("subdomain");

-- AddForeignKey
ALTER TABLE "Store" ADD CONSTRAINT "Store_theme_id_fkey" FOREIGN KEY ("theme_id") REFERENCES "Theme"("theme_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "Store"("store_id") ON DELETE RESTRICT ON UPDATE CASCADE;
