-- CreateEnum
CREATE TYPE "EmailStatus" AS ENUM ('SENT', 'DELIVERED', 'FAILED', 'OPENED');

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

-- AddForeignKey
ALTER TABLE "EmailMessage" ADD CONSTRAINT "EmailMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
