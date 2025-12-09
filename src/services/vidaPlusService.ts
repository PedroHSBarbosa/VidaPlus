import { Prisma } from "@prisma/client";
import { prisma } from "../libs/prisma";


//             FUNÇÕES UTILITÁRIAS   =============================================================================

/**
 * converte e valida um campo para número id
 * @param data 
 * @param key 
 * @returns 
 */

const parseId = (data: any, key: string): number => {
    const id = Number(data[key]);
    if (Number.isNaN(id)) {
        throw new Error(`${key} inválido`);
    }
    return id;
};

/**
 * converte e valida uma string para objeto date
 * @param dateString 
 * @param defaultToNow 
 * @returns 
 */
const parseDate = (dateString: any, defaultToNow: boolean = true): Date => {
    if (dateString) {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            throw new Error(`Data inválida: ${dateString}`);
        }
        return date;
    }
    return defaultToNow ? new Date() : new Date();
};

/**
 * converte uma string JSON para objeto, caso precise
 * @param jsonString 
 * @param key 
 * @returns 
 */
const parseJson = (jsonString: any, key: string) => {
    if (typeof jsonString === "string" && jsonString.trim() !== "") {
        try {
            return JSON.parse(jsonString);
        } catch {
            throw new Error(`${key} inválida`);
        }
    }
    return jsonString;
};

/**
 * função para buscar todos os registros de um modelo
 */
const getMany = async (model: any, options?: any) => {
    return model.findMany(options);
};

//             CRIAÇÃO    ================================================================================================

export const createUnit = async (data: Prisma.UnidadeHospitalarCreateInput) => {
    // Uso do spread operator para sintaxe mais limpa
    return prisma.unidadeHospitalar.create({ data });
}


export const createUser = async (data: any) => {
    const id_unidade = parseId(data, 'id_unidade');
    const data_nascimento = parseDate(data.data_nascimento, true);

    return prisma.paciente.create({
        data: {
            nome: String(data.nome ?? ""),
            cpf: String(data.cpf ?? ""),
            data_nascimento,
            historico_clinico: data.historico_clinico ?? "",
            id_unidade
        }
    });
}

export const createDoctor = async (data: any) => {
    const id_unidade = parseId(data, 'id_unidade');
    const agenda_json = parseJson(data.agenda_json, 'agenda_json');

    return prisma.medico.create({
        data: {
            nome: String(data.nome ?? ""),
            especialidade: String(data.especialidade ?? ""),
            crm: String(data.crm ?? ""),
            agenda_json,
            id_unidade
        }
    });
};

export const createConsultation = async (data: any) => {
    const id_paciente = parseId(data, 'id_paciente');
    const id_medico = parseId(data, 'id_medico');
    const data_hora = parseDate(data.data_hora, true);

    return prisma.consulta.create({
        data: {
            id_paciente,
            id_medico,
            data_hora,
            status: data.status ?? "agendada",
            tipo: data.tipo ?? "rotina"
        }
    });
};

export const createMedicalRecord = async (data: any) => {
    const id_consulta = parseId(data, 'id_consulta');

    const consulta = await prisma.consulta.findUnique({ where: { id_consulta } });
    if (!consulta) throw new Error("Consulta não encontrada");

    return prisma.prontuario.create({
        data: {
            id_consulta,
            data_registro: parseDate(data.data_registro, true),
            descricao: data.descricao ?? "",
            prescricao: data.prescricao ?? ""
        }
    });
};

//             LISTAGEM   =========================================================


export const getAllUser = async () => {
    return getMany(prisma.paciente);
}

export const getAllUnit = async () => {
    return getMany(prisma.unidadeHospitalar);
}

export const getAllDoctor = async () => {
    return getMany(prisma.medico);
}

export const getConsultationById = async (id: number) => {
    return prisma.consulta.findUnique({
        where: { id_consulta: id },
        include: { paciente: true, medico: true, prontuario: true }
    });
};

export const getDoctorAgenda = async (medicoId: number) => {
    return prisma.consulta.findMany({
        where: { id_medico: medicoId },
        include: { paciente: true }
    });
};

export const getMedicalRecordById = async (id: number) => {
    return prisma.prontuario.findUnique({
        where: { id_prontuario: id },
        include: { consulta: { include: { paciente: true, medico: true } } }
    });
};

export const getAllConsultations = async () => {
    return getMany(prisma.consulta, {
        include: {
            paciente: true,
            medico: true
        },
        orderBy: {
            data_hora: 'desc'
        }
    });
}

export const getAllMedicalRecords = async () => {
    return getMany(prisma.prontuario, {
        include: { 
            consulta: {
                include: {
                    paciente: true, 
                    medico: true
                }
            } 
        },
        orderBy: {
            data_registro: 'desc'
        }
    });
}

//           DELETE    =================================================================

export const deleteMedicalRecord = async (id: number) => {
    //  verifica se existe
    const prontuario = await prisma.prontuario.findUnique({ where: { id_prontuario: id } });
    if (!prontuario) throw new Error("Prontuário não encontrado");

    return prisma.prontuario.delete({
        where: { id_prontuario: id },
    });
};

export const deleteConsultation = async (id: number) => {
    // verifica se há dependência (prontuário)
    const hasMedicalRecord = await prisma.prontuario.findUnique({
        where: { id_consulta: id }
    });
    
    if (hasMedicalRecord) {
        throw new Error("Não é possível deletar a consulta. Delete o prontuário associado primeiro.");
    }

    return prisma.consulta.delete({
        where: { id_consulta: id },
    });
};