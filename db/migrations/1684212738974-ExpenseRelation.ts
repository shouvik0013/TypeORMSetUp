import { MigrationInterface, QueryRunner } from "typeorm";

export class ExpenseRelation1684212738974 implements MigrationInterface {
    name = 'ExpenseRelation1684212738974'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "expense" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "amount" integer NOT NULL, "expense_date" date NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "userId" integer)`);
        await queryRunner.query(`CREATE TABLE "temporary_expense" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "amount" integer NOT NULL, "expense_date" date NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "userId" integer, CONSTRAINT "FK_06e076479515578ab1933ab4375" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_expense"("id", "title", "amount", "expense_date", "created_at", "updated_at", "deleted_at", "userId") SELECT "id", "title", "amount", "expense_date", "created_at", "updated_at", "deleted_at", "userId" FROM "expense"`);
        await queryRunner.query(`DROP TABLE "expense"`);
        await queryRunner.query(`ALTER TABLE "temporary_expense" RENAME TO "expense"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "expense" RENAME TO "temporary_expense"`);
        await queryRunner.query(`CREATE TABLE "expense" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "amount" integer NOT NULL, "expense_date" date NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "userId" integer)`);
        await queryRunner.query(`INSERT INTO "expense"("id", "title", "amount", "expense_date", "created_at", "updated_at", "deleted_at", "userId") SELECT "id", "title", "amount", "expense_date", "created_at", "updated_at", "deleted_at", "userId" FROM "temporary_expense"`);
        await queryRunner.query(`DROP TABLE "temporary_expense"`);
        await queryRunner.query(`DROP TABLE "expense"`);
    }

}
