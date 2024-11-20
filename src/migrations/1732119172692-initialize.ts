import { MigrationInterface, QueryRunner } from "typeorm";

export class Initialize1732119172692 implements MigrationInterface {
    name = 'Initialize1732119172692'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "blockchain_token_balances" ("account" character varying NOT NULL, "token" character varying NOT NULL, "balance" character varying NOT NULL, CONSTRAINT "PK_eb64d17d379bed48ad3def6ef0a" PRIMARY KEY ("account", "token"))`);
        await queryRunner.query(`CREATE TYPE "public"."blockchain_subscriptions_basis_enum" AS ENUM('weekly', 'monthly', 'six-monthly')`);
        await queryRunner.query(`CREATE TYPE "public"."blockchain_subscriptions_status_enum" AS ENUM('active', 'inactive', 'expired')`);
        await queryRunner.query(`CREATE TYPE "public"."blockchain_subscriptions_reason_enum" AS ENUM('insufficient-funds', 'unsubscribed')`);
        await queryRunner.query(`CREATE TYPE "public"."blockchain_subscriptions_type_enum" AS ENUM('plus', 'infinite')`);
        await queryRunner.query(`CREATE TABLE "blockchain_subscriptions" ("account" character varying NOT NULL, "planId" integer NOT NULL, "last_execution_timestamp" integer NOT NULL, "next_execution_timestamp" integer NOT NULL, "basis" "public"."blockchain_subscriptions_basis_enum" NOT NULL DEFAULT 'weekly', "receiver" character varying NOT NULL, "token" character varying NOT NULL, "amount" character varying NOT NULL, "status" "public"."blockchain_subscriptions_status_enum" NOT NULL DEFAULT 'active', "reason" "public"."blockchain_subscriptions_reason_enum", "type" "public"."blockchain_subscriptions_type_enum" NOT NULL, CONSTRAINT "PK_406ef37306af1340f83badd7ec5" PRIMARY KEY ("account"))`);
        await queryRunner.query(`CREATE TABLE "blockchain_smart-accounts" ("owner" character varying NOT NULL, "account" character varying NOT NULL, "salt" character varying NOT NULL, CONSTRAINT "PK_2e28501ec1212b38f8443c69169" PRIMARY KEY ("owner", "account"))`);
        await queryRunner.query(`CREATE TYPE "public"."blockchain_activity_logs_type_enum" AS ENUM('wallet_created', 'token_transferred', 'token_received', 'recurring_execution_installed', 'recurring_execution_uninstalled', 'recurring_execution_executed')`);
        await queryRunner.query(`CREATE TABLE "blockchain_activity_logs" ("id" SERIAL NOT NULL, "account" character varying NOT NULL, "type" "public"."blockchain_activity_logs_type_enum" NOT NULL, "timestamp" integer NOT NULL, "data" json, CONSTRAINT "PK_cdff2b00a9b369616837addc07a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "blockchain_blocks" ("hash" character varying NOT NULL, "block" integer NOT NULL, "timestamp" integer NOT NULL, CONSTRAINT "PK_871e8db0b9a26543a5e82156cd1" PRIMARY KEY ("hash", "block"))`);
        await queryRunner.query(`CREATE TABLE "blockchain_recurring_executor_execute_events" ("log_index" integer NOT NULL, "tx_hash" character varying NOT NULL, "block_hash" character varying NOT NULL, "tx_index" integer NOT NULL, "block" integer NOT NULL, "address" character varying NOT NULL, "account" character varying NOT NULL, "planId" character varying NOT NULL, "basis" integer NOT NULL, "receiver" character varying NOT NULL, "token" character varying NOT NULL, "amount" character varying NOT NULL, CONSTRAINT "PK_f6916d5cc954c6591a907225d67" PRIMARY KEY ("log_index", "tx_hash", "block_hash"))`);
        await queryRunner.query(`CREATE TABLE "blockchain_smart_wallet_create_events" ("log_index" integer NOT NULL, "tx_hash" character varying NOT NULL, "block_hash" character varying NOT NULL, "tx_index" integer NOT NULL, "block" integer NOT NULL, "address" character varying NOT NULL, "account" character varying NOT NULL, "owner" character varying NOT NULL, "salt" character varying NOT NULL, CONSTRAINT "PK_3ca7095b781bccdba9d803b28ad" PRIMARY KEY ("log_index", "tx_hash", "block_hash"))`);
        await queryRunner.query(`CREATE TABLE "blockchain_recurring_executor_install_events" ("log_index" integer NOT NULL, "tx_hash" character varying NOT NULL, "block_hash" character varying NOT NULL, "tx_index" integer NOT NULL, "block" integer NOT NULL, "address" character varying NOT NULL, "account" character varying NOT NULL, "planId" character varying NOT NULL, "basis" integer NOT NULL, "receiver" character varying NOT NULL, "token" character varying NOT NULL, "amount" character varying NOT NULL, CONSTRAINT "PK_7eb29766630af29c7bc253d8bda" PRIMARY KEY ("log_index", "tx_hash", "block_hash"))`);
        await queryRunner.query(`CREATE TABLE "blockchain_erc20_transfer_events" ("log_index" integer NOT NULL, "tx_hash" character varying NOT NULL, "block_hash" character varying NOT NULL, "tx_index" integer NOT NULL, "block" integer NOT NULL, "address" character varying NOT NULL, "from" character varying NOT NULL, "to" character varying NOT NULL, "amount" character varying NOT NULL, CONSTRAINT "PK_4002e85b5de3759f907f296f658" PRIMARY KEY ("log_index", "tx_hash", "block_hash"))`);
        await queryRunner.query(`CREATE TABLE "blockchain_recurring_executor_uninstall_events" ("log_index" integer NOT NULL, "tx_hash" character varying NOT NULL, "block_hash" character varying NOT NULL, "tx_index" integer NOT NULL, "block" integer NOT NULL, "address" character varying NOT NULL, "account" character varying NOT NULL, CONSTRAINT "PK_a8a7b4feab8e4a1592557283642" PRIMARY KEY ("log_index", "tx_hash", "block_hash"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "blockchain_recurring_executor_uninstall_events"`);
        await queryRunner.query(`DROP TABLE "blockchain_erc20_transfer_events"`);
        await queryRunner.query(`DROP TABLE "blockchain_recurring_executor_install_events"`);
        await queryRunner.query(`DROP TABLE "blockchain_smart_wallet_create_events"`);
        await queryRunner.query(`DROP TABLE "blockchain_recurring_executor_execute_events"`);
        await queryRunner.query(`DROP TABLE "blockchain_blocks"`);
        await queryRunner.query(`DROP TABLE "blockchain_activity_logs"`);
        await queryRunner.query(`DROP TYPE "public"."blockchain_activity_logs_type_enum"`);
        await queryRunner.query(`DROP TABLE "blockchain_smart-accounts"`);
        await queryRunner.query(`DROP TABLE "blockchain_subscriptions"`);
        await queryRunner.query(`DROP TYPE "public"."blockchain_subscriptions_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."blockchain_subscriptions_reason_enum"`);
        await queryRunner.query(`DROP TYPE "public"."blockchain_subscriptions_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."blockchain_subscriptions_basis_enum"`);
        await queryRunner.query(`DROP TABLE "blockchain_token_balances"`);
    }

}
