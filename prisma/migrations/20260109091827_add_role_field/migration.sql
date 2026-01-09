/*
  Warnings:

  - A unique constraint covering the columns `[role]` on the table `roles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `role` to the `roles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "roles" ADD COLUMN     "role" "RoleType" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "roles_role_key" ON "roles"("role");
