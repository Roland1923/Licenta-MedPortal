import { PatientProfile } from "./patient-profile";

export interface Donor {
    bloodDonorId : string;
    type : string;
    patient : PatientProfile;
    patientId : string;
    applyDate : Date;
    haveDonated : boolean;
    patientConfirmed : boolean;
    pendingPatientId : string;

}

