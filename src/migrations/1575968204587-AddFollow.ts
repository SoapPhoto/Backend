import {MigrationInterface, QueryRunner} from "typeorm";

export class AddFollow1575968204587 implements MigrationInterface {
    name = 'AddFollow1575968204587'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `follow` (`createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `followed_user_id` int NOT NULL, `follower_user_id` int NOT NULL, PRIMARY KEY (`followed_user_id`, `follower_user_id`)) ENGINE=InnoDB", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP TABLE `follow`", undefined);
    }

}
