-- CreateTable
CREATE TABLE "Design" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "is_archived" BOOLEAN NOT NULL DEFAULT false,
    "version" INTEGER NOT NULL DEFAULT 1,
    "user_id" TEXT NOT NULL,
    "org_id" TEXT NOT NULL,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "product_id" TEXT NOT NULL,
    "product_variant" TEXT,
    "product_meta" JSONB,
    "canvas_data" JSONB NOT NULL,
    "thumbnail_url" TEXT,
    "last_edited" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "edit_count" INTEGER NOT NULL DEFAULT 0,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Design_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Design_user_id_idx" ON "Design"("user_id");

-- CreateIndex
CREATE INDEX "Design_org_id_idx" ON "Design"("org_id");

-- CreateIndex
CREATE INDEX "Design_product_id_idx" ON "Design"("product_id");

-- CreateIndex
CREATE INDEX "Design_created_at_idx" ON "Design"("created_at");

-- CreateIndex
CREATE INDEX "Design_status_idx" ON "Design"("status");

-- CreateIndex
CREATE INDEX "Design_tags_idx" ON "Design"("tags");
