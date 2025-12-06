import { Prisma } from "@prisma/client";
import { prisma } from "../libs/prisma";




/*  -------------------------- Criação -------------------------- */


export const createUnit = async (data: Prisma.UnidadeHospitalarCreateInput) => {
    const result = await prisma.unidadeHospitalar.create({
        data: {
            nome: data.nome,
            tipo_unidade: data.tipo_unidade,
            endereco: data.endereco
        }
    })
    return result
}


export const createUser = async (data: any) => {
  const id_unidade = Number(data.id_unidade);
  if (Number.isNaN(id_unidade)) throw new Error("id_unidade inválido");

  const data_nascimento = data.data_nascimento ? new Date(data.data_nascimento) : null;
  if (data_nascimento && isNaN(data_nascimento.getTime())) throw new Error("data_nascimento inválida");

  const result = await prisma.paciente.create({
    data: {
      nome: String(data.nome ?? ""),
      cpf: String(data.cpf ?? ""),
      data_nascimento: data_nascimento ?? new Date(),
      historico_clinico: data.historico_clinico ?? "",
      id_unidade
    }
  });

  return result;
}

export const createDoctor = async (data: any) => {
  const id_unidade = Number(data.id_unidade);
  if (Number.isNaN(id_unidade)) throw new Error("id_unidade inválido");

  let agenda = data.agenda_json ?? null;
  if (typeof agenda === "string" && agenda.trim() !== "") {
    try {
      agenda = JSON.parse(agenda);
    } catch {
      throw new Error("agenda_json inválida");
    }
  }

  const result = await prisma.medico.create({
    data: {
      nome: String(data.nome ?? ""),
      especialidade: String(data.especialidade ?? ""),
      crm: String(data.crm ?? ""),
      agenda_json: agenda,
      id_unidade
    }
  });

  return result;
};

export const createConsultation = async (data: any) => {
  const id_paciente = Number(data.id_paciente);
  const id_medico = Number(data.id_medico);
  if (Number.isNaN(id_paciente) || Number.isNaN(id_medico)) throw new Error("id_paciente ou id_medico inválido");

  const date = data.data_hora ? new Date(data.data_hora) : new Date();
  if (isNaN(date.getTime())) throw new Error("data_hora inválida");

  const result = await prisma.consulta.create({
    data: {
      id_paciente,
      id_medico,
      data_hora: date,
      status: data.status ?? "agendada",
      tipo: data.tipo ?? "rotina"
    }
  });
  return result;
};
export const createMedicalRecord = async (data: any) => {
  const id_consulta = Number(data.id_consulta);
  if (Number.isNaN(id_consulta)) throw new Error("id_consulta inválido");

  const consulta = await prisma.consulta.findUnique({ where: { id_consulta } });
  if (!consulta) throw new Error("Consulta não encontrada");

  const result = await prisma.prontuario.create({
    data: {
      id_consulta,
      data_registro: data.data_registro ? new Date(data.data_registro) : new Date(),
      descricao: data.descricao ?? "",
      prescricao: data.prescricao ?? ""
    }
  });
  return result;
};



/*  -------------------------- Listagem -------------------------- */

export const getAllUser = async () => {
    const result = await prisma.paciente.findMany({})

    return result;
}


export const getAllUnit = async () => {
    const result = await prisma.unidadeHospitalar.findMany({})

    return result;
}

export const getAllDoctor = async () => {
    const result = await prisma.medico.findMany({})

    return result;
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
    // Usamos o include para trazer os dados do Paciente e do Médico,
    // senão só viriam os IDs (id_paciente, id_medico)
    const result = await prisma.consulta.findMany({
        include: {
            paciente: true,
            medico: true
        },
        orderBy: {
            data_hora: 'desc' // Ordenar da mais recente para a mais antiga
        }
    })
    return result;
}