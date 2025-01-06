/*
  Warnings:

  - The primary key for the `AuthLink` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Order` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `OrderItems` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Store` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "AuthLink" DROP CONSTRAINT "AuthLink_userId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_customerId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_storeId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItems" DROP CONSTRAINT "OrderItems_orderId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItems" DROP CONSTRAINT "OrderItems_productId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_storeId_fkey";

-- DropForeignKey
ALTER TABLE "Store" DROP CONSTRAINT "Store_managerId_fkey";

-- AlterTable
ALTER TABLE "AuthLink" DROP CONSTRAINT "AuthLink_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT;
DROP SEQUENCE "AuthLink_id_seq";

-- AlterTable
ALTER TABLE "Order" DROP CONSTRAINT "Order_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "storeId" SET DATA TYPE TEXT,
ALTER COLUMN "customerId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Order_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Order_id_seq";

-- AlterTable
ALTER TABLE "OrderItems" DROP CONSTRAINT "OrderItems_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "orderId" SET DATA TYPE TEXT,
ALTER COLUMN "productId" SET DATA TYPE TEXT,
ADD CONSTRAINT "OrderItems_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "OrderItems_id_seq";

-- AlterTable
ALTER TABLE "Product" DROP CONSTRAINT "Product_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "storeId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Product_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Product_id_seq";

-- AlterTable
ALTER TABLE "Store" DROP CONSTRAINT "Store_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "managerId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Store_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Store_id_seq";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- AddForeignKey
ALTER TABLE "Store" ADD CONSTRAINT "Store_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItems" ADD CONSTRAINT "OrderItems_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItems" ADD CONSTRAINT "OrderItems_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthLink" ADD CONSTRAINT "AuthLink_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
