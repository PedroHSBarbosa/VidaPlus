/*
  Warnings:

  - Added the required column `data_nascimento` to the `Paciente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_unidade` to the `Paciente` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Paciente_cpf_key` ON `paciente`;

-- AlterTable
ALTER TABLE `paciente` ADD COLUMN `data_nascimento` DATETIME(3) NOT NULL,
    ADD COLUMN `historico_clinico` VARCHAR(191) NULL,
    ADD COLUMN `id_unidade` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `UnidadeHospitalar` (
    `id_unidade` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `endereco` VARCHAR(191) NOT NULL,
    `tipo_unidade` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_unidade`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Medico` (
    `id_medico` INTEGER NOT NULL AUTO_INCREMENT,
    `id_unidade` INTEGER NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `crm` VARCHAR(191) NOT NULL,
    `especialidade` VARCHAR(191) NOT NULL,
    `agenda_json` JSON NOT NULL,

    PRIMARY KEY (`id_medico`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Consulta` (
    `id_consulta` INTEGER NOT NULL AUTO_INCREMENT,
    `id_paciente` INTEGER NOT NULL,
    `id_medico` INTEGER NOT NULL,
    `data_hora` DATETIME(3) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `tipo` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_consulta`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Prontuario` (
    `id_prontuario` INTEGER NOT NULL AUTO_INCREMENT,
    `id_consulta` INTEGER NOT NULL,
    `data_registro` DATETIME(3) NOT NULL,
    `descricao` VARCHAR(191) NOT NULL,
    `prescricao` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Prontuario_id_consulta_key`(`id_consulta`),
    PRIMARY KEY (`id_prontuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Paciente` ADD CONSTRAINT `Paciente_id_unidade_fkey` FOREIGN KEY (`id_unidade`) REFERENCES `UnidadeHospitalar`(`id_unidade`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Medico` ADD CONSTRAINT `Medico_id_unidade_fkey` FOREIGN KEY (`id_unidade`) REFERENCES `UnidadeHospitalar`(`id_unidade`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Consulta` ADD CONSTRAINT `Consulta_id_paciente_fkey` FOREIGN KEY (`id_paciente`) REFERENCES `Paciente`(`id_paciente`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Consulta` ADD CONSTRAINT `Consulta_id_medico_fkey` FOREIGN KEY (`id_medico`) REFERENCES `Medico`(`id_medico`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Prontuario` ADD CONSTRAINT `Prontuario_id_consulta_fkey` FOREIGN KEY (`id_consulta`) REFERENCES `Consulta`(`id_consulta`) ON DELETE RESTRICT ON UPDATE CASCADE;
