export interface PatientProfile {
  uid: string;
  fullName: string;
  age?: number;
  gender?: "male" | "female" | "other";
  location?: string;
  language: string;
  createdAt: any;
}

export interface DiagnosisRecord {
  id?: string;
  patientId: string;
  symptoms: string;
  imageUrls?: string[];
  vitals?: {
    heartRate?: number;
    temperature?: number;
    bloodPressure?: string;
  };
  aiAnalysis: string;
  triageLevel: "emergency" | "urgent" | "routine";
  recommendations: string[];
  translatedSummary: string;
  language: string;
  doctorVerification?: {
    status: "pending" | "verified" | "rejected";
    notes: string;
    medicines: string[];
    doctorId: string;
    verifiedAt: any;
  };
  createdAt: any;
}

export interface EmergencyAlert {
  id?: string;
  diagnosisId: string;
  patientId: string;
  location: string;
  status: "pending" | "dispatched" | "resolved";
  createdAt: any;
}

export interface Doctor {
  uid: string;
  fullName: string;
  specialty: string;
  rating: number;
  isAvailable: boolean;
  reviews: string[];
  experience: string;
  imageUrl?: string;
}

export interface Appointment {
  id?: string;
  patientId: string;
  doctorId: string;
  status: "scheduled" | "completed" | "cancelled";
  scheduledAt: any;
  createdAt: any;
}
