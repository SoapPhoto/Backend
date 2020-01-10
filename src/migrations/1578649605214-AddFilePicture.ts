import {MigrationInterface, QueryRunner} from "typeorm";

export class AddFilePicture1578649605214 implements MigrationInterface {
    name = 'AddFilePicture1578649605214'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `file` ADD `pictureId` int NULL", undefined);
        await queryRunner.query("ALTER TABLE `file` ADD CONSTRAINT `FK_c820d066f60be4161468a87da47` FOREIGN KEY (`pictureId`) REFERENCES `picture`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `file` DROP FOREIGN KEY `FK_c820d066f60be4161468a87da47`", undefined);
        await queryRunner.query("ALTER TABLE `file` DROP COLUMN `pictureId`", undefined);
    }

}
