/*
  Warnings:

  - You are about to drop the column `creation_date` on the `administradores` table. All the data in the column will be lost.
  - You are about to drop the column `update_date` on the `administradores` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `administradores` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `administradores` DROP COLUMN `creation_date`,
    DROP COLUMN `update_date`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;
