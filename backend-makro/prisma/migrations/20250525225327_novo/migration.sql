-- CreateTable
CREATE TABLE "Formulario" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "celular" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "status" TEXT DEFAULT 'Em análise',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Formulario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Formulario_email_key" ON "Formulario"("email");
