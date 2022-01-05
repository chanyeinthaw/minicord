-- CreateTable
CREATE TABLE "Space" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "roleId" TEXT
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "isRoot" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "UsersOnSpaces" (
    "spaceId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    PRIMARY KEY ("userId", "spaceId"),
    CONSTRAINT "UsersOnSpaces_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UsersOnSpaces_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ExclusiveRole" (
    "spaceId" INTEGER NOT NULL,
    "roleId" TEXT NOT NULL,

    PRIMARY KEY ("spaceId", "roleId"),
    CONSTRAINT "ExclusiveRole_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Category" (
    "discordId" TEXT NOT NULL,
    "spaceId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY ("spaceId", "discordId"),
    CONSTRAINT "Category_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CategoryDefaultPermission" (
    "roleId" TEXT NOT NULL,
    "permission" TEXT NOT NULL,
    "type" INTEGER NOT NULL,
    "spaceId" INTEGER NOT NULL,

    PRIMARY KEY ("roleId", "spaceId", "type"),
    CONSTRAINT "CategoryDefaultPermission_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Permission" (
    "spaceId" INTEGER NOT NULL,
    "categoryDiscordId" TEXT NOT NULL,
    "permission" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "type" INTEGER NOT NULL,

    PRIMARY KEY ("categoryDiscordId", "spaceId", "roleId", "type"),
    CONSTRAINT "Permission_spaceId_categoryDiscordId_fkey" FOREIGN KEY ("spaceId", "categoryDiscordId") REFERENCES "Category" ("spaceId", "discordId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Space_roleId_key" ON "Space"("roleId");
