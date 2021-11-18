import {MigrationInterface, QueryRunner} from "typeorm";

export class AddLocation1637141749383 implements MigrationInterface {
    name = 'AddLocation1637141749383'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`location\` (\`createTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updateTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`uid\` varchar(255) NOT NULL, \`form\` varchar(255) NOT NULL DEFAULT 'BAIDU', \`streetId\` varchar(255) NULL, \`location\` text NOT NULL, \`name\` varchar(255) NULL, \`address\` varchar(255) NULL, \`province\` varchar(255) NULL, \`city\` varchar(255) NULL, \`area\` varchar(255) NULL, \`detail\` text NOT NULL, PRIMARY KEY (\`uid\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`invite\` (\`createTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updateTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int NOT NULL AUTO_INCREMENT, \`code\` varchar(255) NOT NULL, \`userId\` int NULL, \`userUsername\` varchar(40) NULL, UNIQUE INDEX \`REL_10d8fed0f61511d6a5606bd9d1\` (\`userId\`, \`userUsername\`), PRIMARY KEY (\`id\`, \`code\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`client\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`client\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`client\` ADD \`id\` char(36) NOT NULL PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`accessToken\` DROP COLUMN \`clientId\``);
        await queryRunner.query(`ALTER TABLE \`accessToken\` ADD \`clientId\` char(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`accessToken\` ADD CONSTRAINT \`FK_8cb5c5e1d5330f16598c464b901\` FOREIGN KEY (\`clientId\`) REFERENCES \`client\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`invite\` ADD CONSTRAINT \`FK_10d8fed0f61511d6a5606bd9d1e\` FOREIGN KEY (\`userId\`, \`userUsername\`) REFERENCES \`user\`(\`id\`,\`username\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`invite\` DROP FOREIGN KEY \`FK_10d8fed0f61511d6a5606bd9d1e\``);
        await queryRunner.query(`ALTER TABLE \`accessToken\` DROP FOREIGN KEY \`FK_8cb5c5e1d5330f16598c464b901\``);
        await queryRunner.query(`ALTER TABLE \`accessToken\` DROP COLUMN \`clientId\``);
        await queryRunner.query(`ALTER TABLE \`accessToken\` ADD \`clientId\` varchar(36) COLLATE "utf8mb4_0900_ai_ci" NULL`);
        await queryRunner.query(`ALTER TABLE \`client\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`client\` ADD \`id\` varchar(36) COLLATE "utf8mb4_0900_ai_ci" NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`client\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`DROP INDEX \`REL_10d8fed0f61511d6a5606bd9d1\` ON \`invite\``);
        await queryRunner.query(`DROP TABLE \`invite\``);
        await queryRunner.query(`DROP TABLE \`location\``);
    }

}
