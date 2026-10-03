export interface RsvpGuest {
  id: string;
  fullName: string;
  phoneNumber: string;
  willAttend: 'yes' | 'no';
  adultsCount: number;
  childrenCount: number;
  submittedAt: string;
  eCardCode: string;
  notes?: string;
}

export interface ProgramItem {
  time: string;
  duration: string;
  title: string;
  description?: string;
  bullets?: string[];
  isChurch: boolean;
}

export interface ColorSwatch {
  name: string;
  hex: string;
  textColor: string;
  description: string;
}
