export interface Student {
  id: string | undefined;
  name: string;
  standard: string;
  parentName: string;
  parentContact: string;
}

export interface Teacher {
  id: string;
  name: string;
  standard: string;
  subject: string;  
  contact: string;
}

export interface Subject {
 id: string;
 name: string;
 standard: string;
}

export interface Test {
  subject: string;
  totalMarks: number;
  collectedMarks: number;
}

export enum UserRole {
  Admin = "admin",
  Teacher = "teacher",
}

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
}
