/*
  Warnings:

  - Changed the type of `columnName` on the `Card` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `toListName` on the `CardLogs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ColumnNameEnum" AS ENUM ('BACKLOG', 'TODO', 'DONE');

-- AlterTable
ALTER TABLE "Card" DROP COLUMN "columnName",
ADD COLUMN     "columnName" "ColumnNameEnum" NOT NULL;

-- AlterTable
ALTER TABLE "CardLogs" DROP COLUMN "toListName",
ADD COLUMN     "toListName" "ColumnNameEnum" NOT NULL;
