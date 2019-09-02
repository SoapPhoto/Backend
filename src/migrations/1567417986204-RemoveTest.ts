import {MigrationInterface, QueryRunner} from "typeorm";

export class RemoveTest1567417986204 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `picture` DROP COLUMN `test`");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `picture` ADD `test` int NOT NULL DEFAULT '0'");
    }

}
