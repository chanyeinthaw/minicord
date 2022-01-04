-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Visa" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "roleId" TEXT,
    "isRoot" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Visa" ("id", "isRoot", "roleId") SELECT "id", "isRoot", "roleId" FROM "Visa";
DROP TABLE "Visa";
ALTER TABLE "new_Visa" RENAME TO "Visa";
CREATE UNIQUE INDEX "Visa_roleId_key" ON "Visa"("roleId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
