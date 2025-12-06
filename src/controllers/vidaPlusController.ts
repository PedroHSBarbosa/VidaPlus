import type { Request, Response } from "express";
import *  as vidaPlusService from "../services/vidaPlusService"


/*  -------------------------- Criação -------------------------- */

export async function createUnit(req: Request, res: Response) {
   const data = req.body

   const unit = await vidaPlusService.createUnit(data);
   return res.status(201).json(unit)
}


export async function createUser(req: Request, res: Response) {
   const data = req.body;


   const user = await vidaPlusService.createUser(data);
   return res.status(201).json(user);
}

export async function createDoctor(req: Request, res: Response) {
   const data = req.body;


   const doctor = await vidaPlusService.createDoctor(data);
   return res.status(201).json(doctor);
}


export async function createConsultation(req: Request, res: Response) {
   const data = req.body;

   const consultation = await vidaPlusService.createConsultation(data);
   return res.status(201).json(consultation);
}

export async function createMedicalRecord(req: Request, res: Response) {
   const data = req.body;

   const medicalRecord = await vidaPlusService.createMedicalRecord(data);
   return res.status(201).json(medicalRecord);
}



/*  -------------------------- Listagem -------------------------- */

export async function getAllUser(req: Request, res: Response) {
   const user = await vidaPlusService.getAllUser()
   return res.status(200).json(user);
}


export async function getAllUnit(req: Request, res: Response) {
   const unit = await vidaPlusService.getAllUnit()
   return res.status(200).json(unit);
}

export async function getAllDoctor(req: Request, res: Response) {
   const doctor = await vidaPlusService.getAllDoctor()
   return res.status(200).json(doctor);
}

export async function getConsultationById(req: Request, res: Response) {
   try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) return res.status(400).json({ error: "id inválido" });
      const c = await vidaPlusService.getConsultationById(id);
      if (!c) return res.status(404).json({ error: "Consulta não encontrada" });
      return res.json(c);
   } catch (e: any) {
      console.error(e);
      return res.status(500).json({ error: e.message || "Erro" });
   }
}

export async function getDoctorAgenda(req: Request, res: Response) {
   try {
      const medicoId = Number(req.params.medicoId);
      if (Number.isNaN(medicoId)) return res.status(400).json({ error: "medicoId inválido" });
      const list = await vidaPlusService.getDoctorAgenda(medicoId);
      return res.json(list);
   } catch (e: any) {
      console.error(e);
      return res.status(500).json({ error: e.message || "Erro" });
   }
}

export async function getMedicalRecordById(req: Request, res: Response) {
   try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) return res.status(400).json({ error: "id inválido" });
      const p = await vidaPlusService.getMedicalRecordById(id);
      if (!p) return res.status(404).json({ error: "Prontuário não encontrado" });
      return res.json(p);
   } catch (e: any) {
      console.error(e);
      return res.status(500).json({ error: e.message || "Erro" });
   }
}

export async function getAllConsultations(req: Request, res: Response) {
   try {
       const consultations = await vidaPlusService.getAllConsultations();
       return res.status(200).json(consultations);
   } catch (e: any) {
       console.error(e);
       return res.status(500).json({ error: e.message || "Erro ao buscar consultas" });
   }
}