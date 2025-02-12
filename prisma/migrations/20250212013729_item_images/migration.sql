-- AlterTable
ALTER TABLE "Items" ADD COLUMN     "back_image_url" TEXT,
ADD COLUMN     "front_image_url" TEXT,
ADD COLUMN     "images" JSONB;
