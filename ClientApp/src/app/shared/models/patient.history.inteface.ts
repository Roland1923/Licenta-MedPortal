import { PatientProfile } from "./patient-profile";

export interface PatientHistory {
    historyId : string;
    patient: PatientProfile;
    patientId: string;
    smoke: string;
    drink: string;
    gender: string;
    weight: string;
    height: string;
    healthConditions: string;
    allergies: string;
    consultations: string;
    lastVisit: Date;
}
