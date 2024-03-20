export interface IUser {
    id: string;
    username: string;
    password: string;
    email: string;
    phoneNumber: string;
    registrationDate: string;
}


export interface IOTP {
    userId: string;
    otp: string;
}