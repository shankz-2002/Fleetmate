import type { Manager } from "./Manager";
import type { Part } from "./Part";

export type Bill = {
    id: number;
    laborCharge: number;
    taxes: number;
    totalAmount: number;
    parts?: Part[];
    manager?:Manager;

};