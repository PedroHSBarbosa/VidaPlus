import { Prisma } from "@prisma/client";
import { prisma } from "../libs/prisma";




/*  -------------------------- Criação -------------------------- */

export const createUser = async (data: Prisma.PacienteCreateInput) => {
    const result = await prisma.paciente.create({
        data: {
            nome: data.nome,
            cpf: data.cpf,
            data_nascimento: data.data_nascimento
        }
    })
    return result
}


/*  -------------------------- Listagem -------------------------- */

export const getAllUser = async () => {
    const result = await prisma.paciente.findMany({})

    return result;
}
