export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  available: boolean;
  packets: string[];
  birthDate: Date;
  role?: string; // 'admin' | 'user' | 'delivery'
  isProfileComplete: boolean;
  deliveryProfile?: {
    assignedPacket: string[];
    deliveredPackets: string[];
    vehicle: string;
  };
  location?: string; // Ubicación del usuario (opcional)
}

export interface Packet{
    _id?: string;
    name: string;
    description: string;
    status: string;
    createdAt: Date; // Fecha de creación
    deliveredAt?: Date; // Fecha de entrega (opcional)
    size: number; // Tamaño del paquete
    weight: number; // Peso del paquete
    deliveryId?: string; // ID de la entrega (opcional)
    origin?: string; // Origen del paquete (opcional)
    destination?: string; // Destino del paquete (opcional)
    location?: string;
  
}

export interface Message {
    _id?: string;
    senderId: string; // ID del remitente
    rxId: string; // ID del destinatario
    content?: string; // Contenido del mensaje
    created: Date; // Fecha y hora de envío
    acknowledged: boolean; // Estado de lectura
    roomId: string; // ID de la sala de chat (opcional)
}