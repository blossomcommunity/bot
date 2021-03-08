/*
  Warnings:

  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Profile";

-- CreateTable
CREATE TABLE "profile" (
    "discord_id" TEXT NOT NULL,
    "bio" TEXT NOT NULL,

    PRIMARY KEY ("discord_id")
);
