-- CreateTable
CREATE TABLE "CategoryDefaultPermission" (
    "roleId" TEXT NOT NULL,
    "type" INTEGER NOT NULL,
    "spaceId" INTEGER NOT NULL,

    PRIMARY KEY ("roleId", "spaceId", "type"),
    CONSTRAINT "CategoryDefaultPermission_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
