-- CreateTable
CREATE TABLE "Intervenant" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slots" JSONB NOT NULL,

    CONSTRAINT "Intervenant_pkey" PRIMARY KEY ("id")
);
