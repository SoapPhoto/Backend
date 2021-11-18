import {MigrationInterface, QueryRunner} from "typeorm";

export class ClientId1637143062511 implements MigrationInterface {
    name = 'ClientId1637143062511'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`invite\` ADD CONSTRAINT \`FK_10d8fed0f61511d6a5606bd9d1e\` FOREIGN KEY (\`userId\`, \`userUsername\`) REFERENCES \`user\`(\`id\`,\`username\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`invite\` DROP FOREIGN KEY \`FK_10d8fed0f61511d6a5606bd9d1e\``);
    }

}
