-- CreateTable
CREATE TABLE `subscribers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `neighborhood_id` INTEGER NOT NULL,

    UNIQUE INDEX `subscribers_email_key`(`email`),
    INDEX `subscribers_neighborhood_id_idx`(`neighborhood_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `subscribers` ADD CONSTRAINT `subscribers_neighborhood_id_fkey` FOREIGN KEY (`neighborhood_id`) REFERENCES `neighborhoods`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
