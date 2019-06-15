import { Time } from "@angular/common";
import { Appointment } from "./appointment";

export interface AppointmentInterval {
    appointmentIntervalId : string;
    appointments : Array<Appointment>;
    doctorId : string;
    day : number;
    startHour : Time;
    endHour : Time;
}
