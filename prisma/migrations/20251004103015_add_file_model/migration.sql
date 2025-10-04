-- CreateTable
CREATE TABLE "public"."file" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "size" INTEGER,
    "mimeType" TEXT,
    "key" TEXT NOT NULL,
    "bucket" TEXT NOT NULL,
    "url" TEXT,
    "status" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "file_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "file_key_bucket_key" ON "public"."file"("key", "bucket");
