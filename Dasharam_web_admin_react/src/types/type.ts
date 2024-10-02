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


export interface Admin {
  id: string;
  email: string;
  password: string;
  name: string;
}
