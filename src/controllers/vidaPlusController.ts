import type { Request, Response } from "express";
import * as vidaPlusService from "../services/vidaPlusService";
import {
    createUnitSchema,
    createUserSchema,
    createDoctorSchema,
    createConsultationSchema,
    createMedicalRecordSchema,
    idParamSchema,
    doctorAgendaParamsSchema,
} from "../validators/vidaPlusSchemas";

/* Helper de resposta de erro padronizado */
function handleControllerError(res: Response, e: any, statusCode: number = 400) {
    if (e?.errors) {
        return res.status(400).json({ errors: e.errors });
    }
    console.error(e); 
    return res.status(statusCode).json({ error: e.message || "Erro desconhecido no servidor" });
}

/* -------------------------- Criação -------------------------- */

export async function createUnit(req: Request, res: Response) {
    try {
        const parsed = createUnitSchema.parse(req.body);
        const unit = await vidaPlusService.createUnit(parsed as any);
        return res.status(201).json(unit);
    } catch (e: any) {
        return handleControllerError(res, e);
    }
}

export async function createUser(req: Request, res: Response) {
    try {
        const parsed = createUserSchema.parse(req.body);
        const user = await vidaPlusService.createUser(parsed);
        return res.status(201).json(user);
    } catch (e: any) {
        return handleControllerError(res, e);
    }
}

export async function createDoctor(req: Request, res: Response) {
    try {
        const parsed = createDoctorSchema.parse(req.body);
        const doctor = await vidaPlusService.createDoctor(parsed);
        return res.status(201).json(doctor);
    } catch (e: any) {
        return handleControllerError(res, e);
    }
}

export async function createConsultation(req: Request, res: Response) {
    try {
        const parsed = createConsultationSchema.parse(req.body);
        const consultation = await vidaPlusService.createConsultation(parsed);
        return res.status(201).json(consultation);
    } catch (e: any) {
        return handleControllerError(res, e);
    }
}

export async function createMedicalRecord(req: Request, res: Response) {
    try {
        const parsed = createMedicalRecordSchema.parse(req.body);
        const medicalRecord = await vidaPlusService.createMedicalRecord(parsed);
        return res.status(201).json(medicalRecord);
    } catch (e: any) {
        return handleControllerError(res, e);
    }
}

/* -------------------------- Listagem -------------------------- */

export async function getAllUser(req: Request, res: Response) {
    try {
        const user = await vidaPlusService.getAllUser();
        return res.status(200).json(user);
    } catch (e: any) {
        return handleControllerError(res, e, 500);
    }
}

export async function getAllUnit(req: Request, res: Response) {
    try {
        const unit = await vidaPlusService.getAllUnit();
        return res.status(200).json(unit);
    } catch (e: any) {
        return handleControllerError(res, e, 500);
    }
}

export async function getAllDoctor(req: Request, res: Response) {
    try {
        const doctor = await vidaPlusService.getAllDoctor();
        return res.status(200).json(doctor);
    } catch (e: any) {
        return handleControllerError(res, e, 500);
    }
}

export async function getConsultationById(req: Request, res: Response) {
    try {
        const parsed = idParamSchema.parse(req.params);
        const c = await vidaPlusService.getConsultationById(parsed.id);
        if (!c) return res.status(404).json({ error: "Consulta não encontrada" });
        return res.json(c);
    } catch (e: any) {
        return handleControllerError(res, e);
    }
}

export async function getDoctorAgenda(req: Request, res: Response) {
    try {
        const parsed = doctorAgendaParamsSchema.parse(req.params);
        const list = await vidaPlusService.getDoctorAgenda(parsed.medicoId);
        return res.json(list);
    } catch (e: any) {
        return handleControllerError(res, e);
    }
}

export async function getMedicalRecordById(req: Request, res: Response) {
    try {
        const parsed = idParamSchema.parse(req.params);
        const p = await vidaPlusService.getMedicalRecordById(parsed.id);
        if (!p) return res.status(404).json({ error: "Prontuário não encontrado" });
        return res.json(p);
    } catch (e: any) {
        return handleControllerError(res, e);
    }
}

export async function getAllConsultations(req: Request, res: Response) {
    try {
        const consultations = await vidaPlusService.getAllConsultations();
        return res.status(200).json(consultations);
    } catch (e: any) {
        return handleControllerError(res, e, 500);
    }
}

export async function getAllMedicalRecords(req: Request, res: Response) {
    try {
        const medicalRecords = await vidaPlusService.getAllMedicalRecords();
        return res.status(200).json(medicalRecords);
    } catch (e: any) {
        return handleControllerError(res, e, 500);
    }
}

/* -------------------------- Deleção -------------------------- */

export async function deleteMedicalRecord(req: Request, res: Response) {
    try {
        const parsed = idParamSchema.parse(req.params);
        const result = await vidaPlusService.deleteMedicalRecord(parsed.id);
        return res.status(200).json({ message: "Prontuário removido com sucesso", result });
    } catch (e: any) {
        // Assume 404 se o service lançar erro de "não encontrado"
        const status = String(e.message || "").includes("não encontrado") ? 404 : 400;
        return handleControllerError(res, e, status);
    }
}

export async function deleteConsultation(req: Request, res: Response) {
    try {
        const parsed = idParamSchema.parse(req.params);
        const result = await vidaPlusService.deleteConsultation(parsed.id);
        return res.status(200).json({ message: "Consulta removida com sucesso", result });
    } catch (e: any) {
        // Assume 400 (Bad Request) para erros de dependência lançados pelo service
        const status = String(e.message || "").includes("Não é possível deletar") ? 400 : 500;
        return handleControllerError(res, e, status);
    }
}