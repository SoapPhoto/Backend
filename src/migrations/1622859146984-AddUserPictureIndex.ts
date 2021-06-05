import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUserPictureIndex1622859146984 implements MigrationInterface {
    name = 'AddUserPictureIndex1622859146984'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP INDEX `IDX_a2248fce43e9a62251c22b90e2` ON `picture`");
        await queryRunner.query("CREATE INDEX `IDX_890bb434a545ce9798f6f9714b` ON `picture_user_activity` (`pictureId`, `userId`, `userUsername`)");
        await queryRunner.query("CREATE INDEX `IDX_741b714a860b2304713e6071cd` ON `picture_user_activity` (`pictureId`, `like`)");
        await queryRunner.query("CREATE INDEX `IDX_ae5290b8d3d7e9fe0832cab6d4` ON `picture` (`userId`, `userUsername`, `createTime`, `isPrivate`, `deleted`)");
        await queryRunner.query("CREATE INDEX `IDX_54d31e87de2ff4648ad0255b4a` ON `picture` (`id`, `createTime`, `isPrivate`, `deleted`)");
        await queryRunner.query("CREATE INDEX `IDX_SEARCH` ON `picture` (`createTime`, `isPrivate`, `deleted`)");
        await queryRunner.query("CREATE FULLTEXT INDEX `IDX_KEYWORDS` ON `picture` (`keywords`)");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP INDEX `IDX_KEYWORDS` ON `picture`");
        await queryRunner.query("DROP INDEX `IDX_SEARCH` ON `picture`");
        await queryRunner.query("DROP INDEX `IDX_54d31e87de2ff4648ad0255b4a` ON `picture`");
        await queryRunner.query("DROP INDEX `IDX_ae5290b8d3d7e9fe0832cab6d4` ON `picture`");
        await queryRunner.query("DROP INDEX `IDX_741b714a860b2304713e6071cd` ON `picture_user_activity`");
        await queryRunner.query("DROP INDEX `IDX_890bb434a545ce9798f6f9714b` ON `picture_user_activity`");
        await queryRunner.query("CREATE FULLTEXT INDEX `IDX_a2248fce43e9a62251c22b90e2` ON `picture` (`keywords`)");
    }

}
