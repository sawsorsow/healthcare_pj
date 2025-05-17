
export type UserRole = 'doctor' | 'lab';

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export type LabTestType = 'blood' | 'urine' | 'imaging' | 'other';

export type LabOrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export interface LabTest {
  id: string;
  name: string;
  type: LabTestType;
  normalRange?: string;
  unit?: string;
}

export interface LabOrderTest {
  testId: string;
  testName: string;
  result?: string;
  normalRange?: string;
  unit?: string;
  isAbnormal?: boolean;
}

export interface LabOrder {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  status: LabOrderStatus;
  priority: 'normal' | 'urgent';
  createdAt: Date;
  tests: LabOrderTest[];
  notes?: string;
  completedAt?: Date;
  resultNotes?: string;
}
