export interface User {
    _id?: string;
    name: string;
    email: string;
    password: string;
    phone: string;
    available: boolean;
    packets: object[];
}

export interface Packet{
    _id: string;
  name: string;
  description: string;
  status: string;
  seleccionado?: boolean;
  ubicacion?: string;
}