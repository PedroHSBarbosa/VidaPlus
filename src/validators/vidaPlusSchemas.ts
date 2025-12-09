import { z } from "zod";

/* Schemas de body */
export const createUnitSchema = z.object({
  nome: z.string().min(1),
  tipo_unidade: z.string().min(1),
  endereco: z.string().min(1),
});

export const createUserSchema = z.object({
  nome: z.string().min(1),
  cpf: z.string().min(1),
  data_nascimento: z.string().optional(), // será transformada no service
  id_unidade: z.coerce.number(),
  historico_clinico: z.string().optional().nullable(),
});

export const createDoctorSchema = z.object({
  nome: z.string().min(1),
  crm: z.string().min(1),
  especialidade: z.string().min(1),
  id_unidade: z.coerce.number(),
  // agenda pode vir como string JSON ou objeto
  agenda_json: z
    .union([z.string().min(1), z.record(z.string(), z.unknown())])
    .optional()
    .nullable(),
});

export const createConsultationSchema = z.object({
  id_paciente: z.coerce.number(),
  id_medico: z.coerce.number(),
  data_hora: z.string().optional().nullable(),
  tipo: z.enum(["rotina", "urgencia", "retorno"]).optional(),
  status: z.enum(["agendada", "realizada", "cancelada"]).optional(),
});

export const createMedicalRecordSchema = z.object({
  id_consulta: z.coerce.number(),
  data_registro: z.string().optional().nullable(),
  descricao: z.string().min(1),
  prescricao: z.string().optional().nullable(),
});

/* Schemas de params */
export const idParamSchema = z.object({
  id: z.coerce.number(),
});

export const doctorAgendaParamsSchema = z.object({
  medicoId: z.coerce.number(),
  id: z.coerce.number().optional(),
});