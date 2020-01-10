import {MigrationInterface, QueryRunner} from "typeorm";

export class AddPictureLocation1578627111756 implements MigrationInterface {
    name = 'AddPictureLocation1578627111756'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `picture` ADD `location` text NULL", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `picture` DROP COLUMN `location`", undefined);
    }

}
