-- CreateTable
CREATE TABLE `ecopoints` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `accepted_materials` VARCHAR(191) NOT NULL,
    `collection_days` VARCHAR(191) NOT NULL,
    `collection_time` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `neighborhood_id` INTEGER NOT NULL,
    `admin_id_created` INTEGER NOT NULL,
    `admin_id_updated` INTEGER NULL,

    INDEX `ecopoints_neighborhood_id_idx`(`neighborhood_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ecopoints` ADD CONSTRAINT `ecopoints_neighborhood_id_fkey` FOREIGN KEY (`neighborhood_id`) REFERENCES `neighborhoods`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ecopoints` ADD CONSTRAINT `ecopoints_admin_id_created_fkey` FOREIGN KEY (`admin_id_created`) REFERENCES `administradores`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ecopoints` ADD CONSTRAINT `ecopoints_admin_id_updated_fkey` FOREIGN KEY (`admin_id_updated`) REFERENCES `administradores`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
