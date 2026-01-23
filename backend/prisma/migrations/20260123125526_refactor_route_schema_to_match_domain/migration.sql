/*
  Warnings:

  - You are about to drop the column `days_of_week` on the `routes` table. All the data in the column will be lost.
  - You are about to drop the column `end_time` on the `routes` table. All the data in the column will be lost.
  - You are about to drop the column `start_time` on the `routes` table. All the data in the column will be lost.
  - Added the required column `collection_days` to the `routes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `collection_time` to the `routes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `routes` DROP COLUMN `days_of_week`,
    DROP COLUMN `end_time`,
    DROP COLUMN `start_time`,
    ADD COLUMN `collection_days` VARCHAR(191) NOT NULL,
    ADD COLUMN `collection_time` VARCHAR(191) NOT NULL;
