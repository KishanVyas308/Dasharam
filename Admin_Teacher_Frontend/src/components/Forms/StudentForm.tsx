// src/components/Forms/StudentForm.tsx
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { studentsState } from '../../state/studentsAtom';
import { Student } from '../../types/type';

const StudentForm: React.FC = () => {
  const [students, setStudents] = useRecoilState<Student[]>(studentsState);
  const [name, setName] = useState('');
  const [standard, setStandard] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentContact, setParentContact] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newStudent = {  id: "id", name, standard, parentName, parentContact };
    setStudents([...students, newStudent]);
    // TODO: Add validation
    // TODO : add data to firebase
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block">Student Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field" />
      </div>
      <div>
        <label className="block">Standard</label>
        <input type="text" value={standard} onChange={(e) => setStandard(e.target.value)} className="input-field" />
      </div>
      <div>
        <label className="block">Parent Name</label>
        <input type="text" value={parentName} onChange={(e) => setParentName(e.target.value)} className="input-field" />
      </div>
      <div>
        <label className="block">Parent Contact</label>
        <input type="text" value={parentContact} onChange={(e) => setParentContact(e.target.value)} className="input-field" />
      </div>
      <button type="submit" className="btn-primary">Add Student</button>
    </form>
  );
};

export default StudentForm;
