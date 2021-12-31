-- CreateTable
CREATE TABLE "Visa" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "roleId" TEXT NOT NULL,
    "isRoot" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "Space" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "roleId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "VisasOnSpaces" (
    "visaId" INTEGER NOT NULL,
    "spaceId" INTEGER NOT NULL,

    PRIMARY KEY ("visaId", "spaceId"),
    CONSTRAINT "VisasOnSpaces_visaId_fkey" FOREIGN KEY ("visaId") REFERENCES "Visa" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "VisasOnSpaces_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space" ("id") ON DELETE CASCADE ON UPDATE CASCADE
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
CREATE TABLE "Permission" (
    "spaceId" INTEGER NOT NULL,
    "categoryDiscordId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "type" INTEGER NOT NULL,

    PRIMARY KEY ("categoryDiscordId", "spaceId", "roleId", "type"),
    CONSTRAINT "Permission_spaceId_categoryDiscordId_fkey" FOREIGN KEY ("spaceId", "categoryDiscordId") REFERENCES "Category" ("spaceId", "discordId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Visa_roleId_key" ON "Visa"("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "Space_roleId_key" ON "Space"("roleId");
