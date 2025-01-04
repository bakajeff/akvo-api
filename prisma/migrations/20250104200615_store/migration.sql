-- CreateTable
CREATE TABLE "Store" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "managerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Store_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Store_managerId_key" ON "Store"("managerId");

-- AddForeignKey
ALTER TABLE "Store" ADD CONSTRAINT "Store_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
