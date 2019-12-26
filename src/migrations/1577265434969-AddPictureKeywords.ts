import {MigrationInterface, QueryRunner} from "typeorm";

export class AddPictureKeywords1577265434969 implements MigrationInterface {
    name = 'AddPictureKeywords1577265434969'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `picture` ADD `keywords` varchar(255) NOT NULL", undefined);
        await queryRunner.query("CREATE FULLTEXT INDEX `IDX_a2248fce43e9a62251c22b90e2` ON `picture` (`keywords`)", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP INDEX `IDX_a2248fce43e9a62251c22b90e2` ON `picture`", undefined);
        await queryRunner.query("ALTER TABLE `picture` DROP COLUMN `keywords`", undefined);
    }

}
