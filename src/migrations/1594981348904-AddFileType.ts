import {MigrationInterface, QueryRunner} from "typeorm";

export class AddFileType1594981348904 implements MigrationInterface {
    name = 'AddFileType1594981348904'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `file` CHANGE `type` `type` enum ('AVATAR', 'PICTURE', 'USER_COVER') NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `file` CHANGE `type` `type` enum ('AVATAR', 'PICTURE') COLLATE \"utf8mb4_0900_ai_ci\" NOT NULL");
    }

}
