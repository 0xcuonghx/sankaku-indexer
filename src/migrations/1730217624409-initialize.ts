import { MigrationInterface, QueryRunner } from "typeorm";

export class Initialize1730217624409 implements MigrationInterface {
    name = 'Initialize1730217624409'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "token_balances" ("account" character varying NOT NULL, "token" character varying NOT NULL, "balance" character varying NOT NULL, CONSTRAINT "PK_4cf8d0cad6937e5c26433aff486" PRIMARY KEY ("account", "token"))`);
        await queryRunner.query(`CREATE TABLE "smart_wallet_create_events" ("log_index" integer NOT NULL, "tx_hash" character varying NOT NULL, "block_hash" character varying NOT NULL, "tx_index" integer NOT NULL, "block" integer NOT NULL, "address" character varying NOT NULL, "account" character varying NOT NULL, "owner" character varying NOT NULL, "salt" character varying NOT NULL, CONSTRAINT "PK_5f4978b30b3f358c365bfd2dff5" PRIMARY KEY ("log_index", "tx_hash", "block_hash"))`);
        await queryRunner.query(`CREATE TYPE "public"."subscriptions_basis_enum" AS ENUM('weekly', 'monthly', 'six-monthly')`);
        await queryRunner.query(`CREATE TYPE "public"."subscriptions_status_enum" AS ENUM('active', 'inactive', 'expired')`);
        await queryRunner.query(`CREATE TABLE "subscriptions" ("account" character varying NOT NULL, "planId" integer NOT NULL, "last_execution_timestamp" integer NOT NULL, "basis" "public"."subscriptions_basis_enum" NOT NULL DEFAULT 'weekly', "receiver" character varying NOT NULL, "token" character varying NOT NULL, "amount" character varying NOT NULL, "status" "public"."subscriptions_status_enum" NOT NULL DEFAULT 'active', CONSTRAINT "PK_1cbc78eebc11622c56e6b879455" PRIMARY KEY ("account"))`);
        await queryRunner.query(`CREATE TABLE "blocks" ("hash" character varying NOT NULL, "block" integer NOT NULL, "timestamp" integer NOT NULL, CONSTRAINT "PK_1e37b383e0144403e164009fb5c" PRIMARY KEY ("hash", "block"))`);
        await queryRunner.query(`CREATE TABLE "recurring_executor_install_events" ("log_index" integer NOT NULL, "tx_hash" character varying NOT NULL, "block_hash" character varying NOT NULL, "tx_index" integer NOT NULL, "block" integer NOT NULL, "address" character varying NOT NULL, "account" character varying NOT NULL, "planId" character varying NOT NULL, "basis" integer NOT NULL, "receiver" character varying NOT NULL, "token" character varying NOT NULL, "amount" character varying NOT NULL, CONSTRAINT "PK_7ffb2c0f5777619249175b2949b" PRIMARY KEY ("log_index", "tx_hash", "block_hash"))`);
        await queryRunner.query(`CREATE TABLE "erc20_transfer_events" ("log_index" integer NOT NULL, "tx_hash" character varying NOT NULL, "block_hash" character varying NOT NULL, "tx_index" integer NOT NULL, "block" integer NOT NULL, "address" character varying NOT NULL, "from" character varying NOT NULL, "to" character varying NOT NULL, "amount" character varying NOT NULL, CONSTRAINT "PK_095a15cf3008f0cf657b985267c" PRIMARY KEY ("log_index", "tx_hash", "block_hash"))`);
        await queryRunner.query(`CREATE TABLE "recurring_executor_execute_events" ("log_index" integer NOT NULL, "tx_hash" character varying NOT NULL, "block_hash" character varying NOT NULL, "tx_index" integer NOT NULL, "block" integer NOT NULL, "address" character varying NOT NULL, "account" character varying NOT NULL, "planId" character varying NOT NULL, "basis" integer NOT NULL, "receiver" character varying NOT NULL, "token" character varying NOT NULL, "amount" character varying NOT NULL, CONSTRAINT "PK_b0eaf1a53ddb777ac4f9e4f4d1b" PRIMARY KEY ("log_index", "tx_hash", "block_hash"))`);
        await queryRunner.query(`CREATE TABLE "recurring_executor_uninstall_events" ("log_index" integer NOT NULL, "tx_hash" character varying NOT NULL, "block_hash" character varying NOT NULL, "tx_index" integer NOT NULL, "block" integer NOT NULL, "address" character varying NOT NULL, "account" character varying NOT NULL, CONSTRAINT "PK_e228cfbd2790afeecb19c940ead" PRIMARY KEY ("log_index", "tx_hash", "block_hash"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "recurring_executor_uninstall_events"`);
        await queryRunner.query(`DROP TABLE "recurring_executor_execute_events"`);
        await queryRunner.query(`DROP TABLE "erc20_transfer_events"`);
        await queryRunner.query(`DROP TABLE "recurring_executor_install_events"`);
        await queryRunner.query(`DROP TABLE "blocks"`);
        await queryRunner.query(`DROP TABLE "subscriptions"`);
        await queryRunner.query(`DROP TYPE "public"."subscriptions_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."subscriptions_basis_enum"`);
        await queryRunner.query(`DROP TABLE "smart_wallet_create_events"`);
        await queryRunner.query(`DROP TABLE "token_balances"`);
    }

}
