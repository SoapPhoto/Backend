import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateTagKey1573205692257 implements MigrationInterface {
    name = 'UpdateTagKey1573205692257'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `picture_tags` DROP FOREIGN KEY `FK_7fba5ad9d982d1453f367d7e5c4`", undefined);
        await queryRunner.query("DROP INDEX `IDX_7fba5ad9d982d1453f367d7e5c` ON `picture_tags`", undefined);
        await queryRunner.query("ALTER TABLE `picture_tags` DROP PRIMARY KEY", undefined);
        await queryRunner.query("ALTER TABLE `picture_tags` ADD PRIMARY KEY (`pictureId`, `tagId`)", undefined);
        await queryRunner.query("ALTER TABLE `picture_tags` DROP COLUMN `tagName`", undefined);
        await queryRunner.query("ALTER TABLE `tag` CHANGE `name` `name` varchar(120) COLLATE \"utf8mb4_unicode_ci\" NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `tag` CHANGE `id` `id` int NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `tag` DROP PRIMARY KEY", undefined);
        await queryRunner.query("ALTER TABLE `tag` ADD PRIMARY KEY (`id`)", undefined);
        await queryRunner.query("ALTER TABLE `tag` CHANGE `id` `id` int NOT NULL AUTO_INCREMENT", undefined);
        await queryRunner.query("ALTER TABLE `tag` ADD UNIQUE INDEX `IDX_6a9775008add570dc3e5a0bab7` (`name`)", undefined);
        await queryRunner.query("CREATE INDEX `IDX_6cedd3e926bb43a4596ab6fd2f` ON `picture_tags` (`tagId`)", undefined);
        await queryRunner.query("ALTER TABLE `picture_tags` ADD CONSTRAINT `FK_6cedd3e926bb43a4596ab6fd2f2` FOREIGN KEY (`tagId`) REFERENCES `tag`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `picture_tags` DROP FOREIGN KEY `FK_6cedd3e926bb43a4596ab6fd2f2`", undefined);
        await queryRunner.query("DROP INDEX `IDX_6cedd3e926bb43a4596ab6fd2f` ON `picture_tags`", undefined);
        await queryRunner.query("ALTER TABLE `tag` DROP INDEX `IDX_6a9775008add570dc3e5a0bab7`", undefined);
        await queryRunner.query("ALTER TABLE `tag` CHANGE `id` `id` int NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `tag` DROP PRIMARY KEY", undefined);
        await queryRunner.query("ALTER TABLE `tag` ADD PRIMARY KEY (`id`, `name`)", undefined);
        await queryRunner.query("ALTER TABLE `tag` CHANGE `id` `id` int NOT NULL AUTO_INCREMENT", undefined);
        await queryRunner.query("ALTER TABLE `tag` CHANGE `name` `name` varchar(120) COLLATE \"utf8mb4_0900_ai_ci\" NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `picture_tags` ADD `tagName` varchar(120) COLLATE \"utf8mb4_0900_ai_ci\" NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `picture_tags` DROP PRIMARY KEY", undefined);
        await queryRunner.query("ALTER TABLE `picture_tags` ADD PRIMARY KEY (`pictureId`, `tagId`, `tagName`)", undefined);
        await queryRunner.query("CREATE INDEX `IDX_7fba5ad9d982d1453f367d7e5c` ON `picture_tags` (`tagId`, `tagName`)", undefined);
        await queryRunner.query("ALTER TABLE `picture_tags` ADD CONSTRAINT `FK_7fba5ad9d982d1453f367d7e5c4` FOREIGN KEY (`tagId`, `tagName`) REFERENCES `tag`(`id`,`name`) ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
    }

}
