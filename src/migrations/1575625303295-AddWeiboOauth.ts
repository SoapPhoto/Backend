import {MigrationInterface, QueryRunner} from "typeorm";

export class AddWeiboOauth1575625303295 implements MigrationInterface {
    name = 'AddWeiboOauth1575625303295'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `user_credentials` CHANGE `type` `type` enum ('GITHUB', 'GOOGLE', 'WEIBO') NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `user` CHANGE `signupType` `signupType` enum ('EMAIL', 'GITHUB', 'GOOGLE', 'WEIBO') NOT NULL DEFAULT 'EMAIL'", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `user` CHANGE `signupType` `signupType` enum ('EMAIL', 'GITHUB', 'GOOGLE') COLLATE \"utf8mb4_0900_ai_ci\" NOT NULL DEFAULT 'EMAIL'", undefined);
        await queryRunner.query("ALTER TABLE `user_credentials` CHANGE `type` `type` enum ('GITHUB', 'GOOGLE') COLLATE \"utf8mb4_0900_ai_ci\" NOT NULL", undefined);
    }

}
