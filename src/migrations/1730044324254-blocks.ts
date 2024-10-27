import { MigrationInterface, QueryRunner } from "typeorm";

export class Blocks1730044324254 implements MigrationInterface {
    name = 'Blocks1730044324254'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "blocks" ("block" integer NOT NULL, "timestamp" integer NOT NULL, CONSTRAINT "PK_14531eead68b1bdaeda5f65bbbe" PRIMARY KEY ("block"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "blocks"`);
    }

}
