export interface Mechanic {
    id: number;
    name: string;
    skills: string[];
    isEngaed:boolean;
    user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}
