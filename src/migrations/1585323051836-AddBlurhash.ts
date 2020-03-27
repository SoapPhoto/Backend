import {MigrationInterface, QueryRunner} from "typeorm";

export class AddBlurhash1585323051836 implements MigrationInterface {
    name = 'AddBlurhash1585323051836'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `picture` ADD `blurhash` varchar(255) NULL", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `picture` DROP COLUMN `blurhash`", undefined);
    }

}
