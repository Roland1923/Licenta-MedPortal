import { Appointment } from "./appointment.interface";
import { Feedback } from "./feedback.interface";

export interface DoctorProfile {
    id : string;
    din : string;
    firstName : string;
    lastName : string;
    email : string;
    password : string;
    newPassword : string;
    phoneNumber : string;
    city : string;
    country: string;
    description : string;
    speciality : string;
    hospital : string;
    address : string;

    appointments : Array<Appointment>;
    feedbacks : Array<Feedback>;
}
