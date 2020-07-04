import {MigrationInterface, QueryRunner} from "typeorm";

export class AddPictureDeleted1593851551985 implements MigrationInterface {
    name = 'AddPictureDeleted1593851551985'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `picture` ADD `deleted` int NOT NULL DEFAULT 0");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `picture` DROP COLUMN `deleted`");
    }

}
