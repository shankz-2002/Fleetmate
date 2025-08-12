// export interface Appointment {
//     id: number;
//     date: string;
//     status: string;
//     remarks:string;
//     vehicle: {
//         id: number;
//         make: string;
//         model: string;
//     };

import type { Mechanic } from "./Mechanic";
import type { Part } from "./Part";

// }
export interface Appointment {
    id: number;
    appointmentDate: string;
    status: string;
    remarks?: string;
    vehicle: {
        make: string;
        model: string;
        [key: string]: any;
    };
    mechanic?: Mechanic;
    bill?: {
        id: number;
        laborCharge: number;
        taxes: number;
        totalAmount: number;
        parts?: Part[];
    } | null;


}




