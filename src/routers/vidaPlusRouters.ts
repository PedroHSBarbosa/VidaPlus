import { Router } from "express";
import { createConsultation, createDoctor, createMedicalRecord, createUnit, createUser, deleteConsultation, deleteMedicalRecord, getAllConsultations, getAllDoctor, getAllMedicalRecords, getAllUnit, getAllUser, getConsultationById, getDoctorAgenda, getMedicalRecordById } from "../controllers/vidaPlusController";


export const mainRouter = Router();


mainRouter.post("/user", createUser);

mainRouter.post("/unit", createUnit);

mainRouter.post("/doctor", createDoctor)

mainRouter.post("/consultation", createConsultation)

mainRouter.post("/medicalRecord", createMedicalRecord)

mainRouter.get("/users", getAllUser);

mainRouter.get("/units", getAllUnit);

mainRouter.get("/doctors", getAllDoctor)

mainRouter.get("/consultation/:id", getConsultationById)

mainRouter.get("/consultations/doctor/:medicoId/:id", getDoctorAgenda)

mainRouter.get("/medicalRecord/:id", getMedicalRecordById)

mainRouter.get("/consultations", getAllConsultations)

mainRouter.get("/medicalrecords", getAllMedicalRecords)

mainRouter.delete('/consultations/:id', deleteConsultation);

mainRouter.delete('/medicalrecords/:id', deleteMedicalRecord);








