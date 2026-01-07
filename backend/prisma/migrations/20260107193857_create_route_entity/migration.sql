-- CreateTable
CREATE TABLE `routes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `days_of_week` VARCHAR(191) NOT NULL,
    `collection_type` VARCHAR(191) NOT NULL,
    `start_time` DATETIME(3) NOT NULL,
    `end_time` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `admin_id_created` INTEGER NOT NULL,
    `admin_id_updated` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `routes` ADD CONSTRAINT `routes_admin_id_created_fkey` FOREIGN KEY (`admin_id_created`) REFERENCES `administradores`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `routes` ADD CONSTRAINT `routes_admin_id_updated_fkey` FOREIGN KEY (`admin_id_updated`) REFERENCES `administradores`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
