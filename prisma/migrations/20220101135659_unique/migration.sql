-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Visa" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "roleId" TEXT,
    "isRoot" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_Visa" ("id", "isRoot", "roleId") SELECT "id", "isRoot", "roleId" FROM "Visa";
DROP TABLE "Visa";
ALTER TABLE "new_Visa" RENAME TO "Visa";
CREATE UNIQUE INDEX "Visa_roleId_key" ON "Visa"("roleId");
CREATE TABLE "new_Space" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "roleId" TEXT
);
INSERT INTO "new_Space" ("id", "name", "roleId") SELECT "id", "name", "roleId" FROM "Space";
DROP TABLE "Space";
ALTER TABLE "new_Space" RENAME TO "Space";
CREATE UNIQUE INDEX "Space_roleId_key" ON "Space"("roleId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
