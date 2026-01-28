/*
  Warnings:

  - You are about to drop the column `address` on the `ecopoints` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `subscribers` table. All the data in the column will be lost.
  - Added the required column `street` to the `ecopoints` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `subscribers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ecopoints` DROP COLUMN `address`,
    ADD COLUMN `complement` VARCHAR(191) NULL,
    ADD COLUMN `latitude` DOUBLE NULL,
    ADD COLUMN `longitude` DOUBLE NULL,
    ADD COLUMN `number` VARCHAR(191) NULL,
    ADD COLUMN `postal_code` VARCHAR(191) NULL,
    ADD COLUMN `street` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `subscribers` DROP COLUMN `address`,
    ADD COLUMN `complement` VARCHAR(191) NULL,
    ADD COLUMN `latitude` DOUBLE NULL,
    ADD COLUMN `longitude` DOUBLE NULL,
    ADD COLUMN `number` VARCHAR(191) NULL,
    ADD COLUMN `postal_code` VARCHAR(191) NULL,
    ADD COLUMN `street` VARCHAR(191) NOT NULL;
