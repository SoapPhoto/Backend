import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUserCover1594980492356 implements MigrationInterface {
    name = 'AddUserCover1594980492356'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user` ADD `cover` varchar(255) NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `cover`");
    }

}
