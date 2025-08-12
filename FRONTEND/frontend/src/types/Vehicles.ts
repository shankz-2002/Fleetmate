export interface Vehicle {
    id: number;
    make: string;
    model: string;
    year: number;
    regNumber: string;
    customerProfileId?: string;
    customer: {
        name: string
    }
}