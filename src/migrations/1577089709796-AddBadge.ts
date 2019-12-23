import {MigrationInterface, QueryRunner} from "typeorm";

export class AddBadge1577089709796 implements MigrationInterface {
    name = 'AddBadge1577089709796'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `badge` (`createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `type` enum ('USER', 'PICTURE') NOT NULL DEFAULT 'PICTURE', `name` varchar(255) NOT NULL, `rate` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `picture_badge_activity` (`createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `badgeId` int NOT NULL, `pictureId` int NOT NULL, `createUserId` int NOT NULL, PRIMARY KEY (`id`, `badgeId`, `pictureId`)) ENGINE=InnoDB", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP TABLE `picture_badge_activity`", undefined);
        await queryRunner.query("DROP TABLE `badge`", undefined);
    }

}
