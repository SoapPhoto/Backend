import {MigrationInterface, QueryRunner} from "typeorm";

export class ClientId1637142984063 implements MigrationInterface {
    name = 'ClientId1637142984063'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`invite\` (\`createTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updateTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int NOT NULL AUTO_INCREMENT, \`code\` varchar(255) NOT NULL, \`userId\` int NULL, \`userUsername\` varchar(40) NULL, UNIQUE INDEX \`REL_10d8fed0f61511d6a5606bd9d1\` (\`userId\`, \`userUsername\`), PRIMARY KEY (\`id\`, \`code\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`invite\` ADD CONSTRAINT \`FK_10d8fed0f61511d6a5606bd9d1e\` FOREIGN KEY (\`userId\`, \`userUsername\`) REFERENCES \`user\`(\`id\`,\`username\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`invite\` DROP FOREIGN KEY \`FK_10d8fed0f61511d6a5606bd9d1e\``);
        await queryRunner.query(`DROP INDEX \`REL_10d8fed0f61511d6a5606bd9d1\` ON \`invite\``);
        await queryRunner.query(`DROP TABLE \`invite\``);
    }

}
