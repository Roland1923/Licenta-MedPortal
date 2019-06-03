import { Appointment } from "./appointment.interface";
import { Feedback } from "./feedback.interface";
import { PatientHistory } from "./patient.history.inteface";

export interface PatientProfile {
    id : string;
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

    appointments : Array<Appointment>;
    feedbacks : Array<Feedback>;
    patientHistories : Array<PatientHistory>;
}
