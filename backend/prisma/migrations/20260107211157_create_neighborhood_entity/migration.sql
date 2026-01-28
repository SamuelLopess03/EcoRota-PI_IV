-- CreateTable
CREATE TABLE `neighborhoods` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `cep` VARCHAR(191) NOT NULL,
    `population_estimate` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `route_id` INTEGER NOT NULL,
    `admin_id_created` INTEGER NOT NULL,
    `admin_id_updated` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `neighborhoods` ADD CONSTRAINT `neighborhoods_route_id_fkey` FOREIGN KEY (`route_id`) REFERENCES `routes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `neighborhoods` ADD CONSTRAINT `neighborhoods_admin_id_created_fkey` FOREIGN KEY (`admin_id_created`) REFERENCES `administradores`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `neighborhoods` ADD CONSTRAINT `neighborhoods_admin_id_updated_fkey` FOREIGN KEY (`admin_id_updated`) REFERENCES `administradores`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
