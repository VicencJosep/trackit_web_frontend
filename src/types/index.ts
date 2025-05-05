export interface User {
    _id?: string;
    name: string;
    email: string;
    password: string;
    phone: string;
    available: boolean;
    packets: string[];
    birthDate: Date;
    isProfileComplete: boolean;
}

export interface Packet{
    _id: string;
  name: string;
  description: string;
  status: string;
  seleccionado?: boolean;
}