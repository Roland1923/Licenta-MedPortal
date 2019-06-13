import { Appointment } from "./appointment";
import { Feedback } from "./feedback.interface";
import { AppointmentInterval } from "./appointment-interval";

export interface DoctorProfile {
    doctorId : string;
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

    appointmentIntervals : Array<AppointmentInterval>
    appointments : Array<Appointment>;
    feedbacks : Array<Feedback>;
}
