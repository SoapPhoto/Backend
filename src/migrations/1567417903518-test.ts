import {MigrationInterface, QueryRunner} from "typeorm";

export class test1567417903518 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `picture` ADD `test` int NOT NULL DEFAULT 0");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `picture` DROP COLUMN `test`");
    }

}
