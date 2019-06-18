import { AppointmentInterval } from "./appointment-interval";
import { PatientProfile } from "./patient-profile";
import { DoctorProfile } from "./doctor-profile";

export interface Appointment {
    appointmentId : string;
    patientId : string; 
    patient  : PatientProfile;
    doctorId : string;
    doctor : DoctorProfile; 
    appointmentDate : Date;
    appointmentIntervalId : string;
    appointmentInterval : AppointmentInterval;
    haveFeedback: boolean;
}


