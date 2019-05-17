export interface PatientRegistration {
    nin : string;
    firstName : string;
    lastName : string;
    email : string;
    password : string;
    confirm_password : string;
    city : string;
    country : string;
    birthdate : Date;
    phoneNumber : string;
}