import {MigrationInterface, QueryRunner} from "typeorm";

export class AddReplyNotify1575376832855 implements MigrationInterface {
    name = 'AddReplyNotify1575376832855'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `notification` CHANGE `category` `category` enum ('LIKED', 'COMMENT', 'REPLY', 'FOLLOW') NOT NULL", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `notification` CHANGE `category` `category` enum ('LIKED', 'COMMENT', 'FOLLOW') COLLATE \"utf8mb4_0900_ai_ci\" NOT NULL", undefined);
    }

}
