-- CreateTable
CREATE TABLE `reported_problems` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `problem_type` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `url_attachments` VARCHAR(191) NOT NULL,
    `protocol` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `subscriber_id` INTEGER NOT NULL,
    `resolved_by_admin_id` INTEGER NULL,

    INDEX `reported_problems_status_idx`(`status`),
    INDEX `reported_problems_protocol_idx`(`protocol`),
    INDEX `reported_problems_subscriber_id_idx`(`subscriber_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `reported_problems` ADD CONSTRAINT `reported_problems_subscriber_id_fkey` FOREIGN KEY (`subscriber_id`) REFERENCES `subscribers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reported_problems` ADD CONSTRAINT `reported_problems_resolved_by_admin_id_fkey` FOREIGN KEY (`resolved_by_admin_id`) REFERENCES `administradores`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
