import {MigrationInterface, QueryRunner} from "typeorm";

export class AddNotification1569252881386 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `notification_subscribers_user` DROP FOREIGN KEY `FK_bdae6c4a10f751273a18c54ab2a`", undefined);
        await queryRunner.query("ALTER TABLE `notification` DROP FOREIGN KEY `FK_8981f3185dbb71c49f2fdf18ef2`", undefined);
        await queryRunner.query("ALTER TABLE `notification` ADD `category` enum ('LIKED', 'COMMENT', 'FOLLOW') NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `notification` ADD `mediaId` varchar(255) NULL", undefined);
        await queryRunner.query("ALTER TABLE `notification` ADD `type` enum ('USER', 'SYSTEM') NOT NULL DEFAULT 'USER'", undefined);
        await queryRunner.query("ALTER TABLE `notification_subscribers_user` ADD CONSTRAINT `FK_bdae6c4a10f751273a18c54ab2a` FOREIGN KEY (`notificationId`) REFERENCES `notification`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `notification` ADD CONSTRAINT `FK_8981f3185dbb71c49f2fdf18ef2` FOREIGN KEY (`publisherId`, `publisherUsername`) REFERENCES `user`(`id`,`username`) ON DELETE SET NULL ON UPDATE NO ACTION", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `notification` DROP FOREIGN KEY `FK_8981f3185dbb71c49f2fdf18ef2`", undefined);
        await queryRunner.query("ALTER TABLE `notification_subscribers_user` DROP FOREIGN KEY `FK_bdae6c4a10f751273a18c54ab2a`", undefined);
        await queryRunner.query("ALTER TABLE `notification` DROP COLUMN `type`", undefined);
        await queryRunner.query("ALTER TABLE `notification` DROP COLUMN `mediaId`", undefined);
        await queryRunner.query("ALTER TABLE `notification` DROP COLUMN `category`", undefined);
        await queryRunner.query("ALTER TABLE `notification` ADD CONSTRAINT `FK_8981f3185dbb71c49f2fdf18ef2` FOREIGN KEY (`publisherId`, `publisherUsername`) REFERENCES `user`(`id`,`username`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `notification_subscribers_user` ADD CONSTRAINT `FK_bdae6c4a10f751273a18c54ab2a` FOREIGN KEY (`notificationId`) REFERENCES `notification`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
    }

}
