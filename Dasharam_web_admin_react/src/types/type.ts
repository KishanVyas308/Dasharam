export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  subject: string;
  teacher: string;
  date: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  subject: string;
  date: string;
}

export interface Subject {
  id: string;
  name: string;
  teacher: string;
  date: string;
}
