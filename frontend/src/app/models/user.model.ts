export interface User {
  id: number;
  userId: string;
  name: string;
  email: string;
  role: 'Admin' | 'General User';
  department: string;
  joinDate: string;
  status: string;
}

export interface LoginRequest {
  userId: string;
  password: string;
  role: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface Record {
  id: number;
  title: string;
  category: string;
  date: string;
  status: string;
  accessLevel: string;
}

export interface RecordsResponse {
  totalRecords: number;
  userRole: string;
  delayApplied: number;
  records: Record[];
}

