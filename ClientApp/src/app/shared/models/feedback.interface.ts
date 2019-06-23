import { PatientProfile } from "./patient-profile";
import { DoctorProfile } from "./doctor-profile";

export interface Feedback {
    description : string;
    rating : number;
    doctorId: string;
    patientId: string;
    patient: PatientProfile;
    doctor: DoctorProfile;
    reviewDate: Date;
    appointmentDate: Date;
}
