import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUserGenderAndBirthday1622018912900 implements MigrationInterface {
    name = 'AddUserGenderAndBirthday1622018912900'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `picture` ADD `classify` text NULL");
        await queryRunner.query("ALTER TABLE `user` ADD `gender` tinyint NOT NULL DEFAULT '0'");
        await queryRunner.query("ALTER TABLE `user` ADD `genderSecret` tinyint NOT NULL DEFAULT 0");
        await queryRunner.query("ALTER TABLE `user` ADD `birthday` datetime NULL");
        await queryRunner.query("ALTER TABLE `user` ADD `birthdayShow` tinyint NOT NULL DEFAULT '1'");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `birthdayShow`");
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `birthday`");
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `genderSecret`");
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `gender`");
        await queryRunner.query("ALTER TABLE `picture` DROP COLUMN `classify`");
    }

}
