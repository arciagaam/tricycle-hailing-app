/*
  Warnings:

  - The `specialFare` column on the `Dropoff` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `multipleFare` column on the `Dropoff` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Dropoff" DROP COLUMN "specialFare",
ADD COLUMN     "specialFare" DOUBLE PRECISION,
DROP COLUMN "multipleFare",
ADD COLUMN     "multipleFare" DOUBLE PRECISION;
