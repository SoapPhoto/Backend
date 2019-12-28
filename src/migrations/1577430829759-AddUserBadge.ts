import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUserBadge1577430829759 implements MigrationInterface {
    name = 'AddUserBadge1577430829759'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `user_badge_activity` (`createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `badgeId` int NOT NULL, `userId` int NOT NULL, `createUserId` int NOT NULL, PRIMARY KEY (`id`, `badgeId`, `userId`)) ENGINE=InnoDB", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP TABLE `user_badge_activity`", undefined);
    }

}
