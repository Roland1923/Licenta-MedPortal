import { Appointment } from "./appointment";
import { Feedback } from "./feedback.interface";
import { PatientHistory } from "./patient.history.inteface";
import { Donor } from "./donor";

export interface PatientProfile {
    patientId : string;
    nin : string;
    firstName : string;
    lastName : string;
    email : string;
    password : string;
    newPassword : string;
    phoneNumber : string;
    city : string;
    country: string;
    birthdate : Date;
    bloodDonor: Donor;
    appointments : Array<Appointment>;
    feedbacks : Array<Feedback>;
    patientHistories : Array<PatientHistory>;
}
