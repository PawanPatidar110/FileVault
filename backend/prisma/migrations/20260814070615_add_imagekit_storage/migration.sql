-- AlterTable
ALTER TABLE "File" ADD COLUMN     "storageFileId" TEXT,
ADD COLUMN     "storageProvider" TEXT NOT NULL DEFAULT 'LOCAL';
