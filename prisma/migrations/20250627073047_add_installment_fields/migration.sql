-- AlterTable
ALTER TABLE "Expense" ADD COLUMN "installmentGroupId" TEXT;
ALTER TABLE "Expense" ADD COLUMN "installmentNumber" INTEGER;
ALTER TABLE "Expense" ADD COLUMN "totalInstallments" INTEGER;
