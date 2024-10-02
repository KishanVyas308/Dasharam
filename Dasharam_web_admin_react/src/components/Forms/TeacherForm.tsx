// src/components/Forms/TeacherForm.tsx
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { teachersState } from '../../state/teachersAtom';

const TeacherForm: React.FC = () => {
  const [teachers, setTeachers] = useRecoilState(teachersState);
  const [name, setName] = useState('');
  const [standard, setStandard] = useState('');
  const [subject, setSubject] = useState('');
  const [contact, setContact] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTeacher = { id: "id",  name, standard ,subject, contact };
    setTeachers([...teachers, newTeacher]);
    // Add logic to save the teacher to Firebase
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block">Teacher Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field" />
      </div>
      <div>
      <div>
        <label className="block">Standrad</label>
        <input type="text" value={standard} onChange={(e) => setStandard(e.target.value)} className="input-field" />
      </div>
        <label className="block">Subject</label>
        <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} className="input-field" />
      </div>
      <div>
        <label className="block">Contact</label>
        <input type="text" value={contact} onChange={(e) => setContact(e.target.value)} className="input-field" />
      </div>
      <button type="submit" className="btn-primary">Add Teacher</button>
    </form>
  );
};

export default TeacherForm;
