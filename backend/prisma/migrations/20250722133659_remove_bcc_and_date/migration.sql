/*
  Warnings:

  - You are about to drop the column `bccEmail` on the `PermissionRequest` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `PermissionRequest` table. All the data in the column will be lost.
  - Changed the type of `startTime` on the `PermissionRequest` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `endTime` on the `PermissionRequest` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "PermissionRequest" DROP COLUMN "bccEmail",
DROP COLUMN "date",
DROP COLUMN "startTime",
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL,
DROP COLUMN "endTime",
ADD COLUMN     "endTime" TIMESTAMP(3) NOT NULL;
