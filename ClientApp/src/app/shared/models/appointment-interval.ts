import { Time } from "@angular/common";

export interface AppointmentInterval {
    appointmentIntervalId : string;
    day : number;
    startHour : Time;
    endHour : Time;
}
