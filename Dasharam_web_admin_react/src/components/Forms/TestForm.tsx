// src/components/Forms/TestForm.tsx
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { testsState } from '../../state/testsAtom';

const TestForm: React.FC = () => {
  const [tests, setTests] = useRecoilState(testsState);
  const [subject, setSubject] = useState('');
  const [totalMarks, setTotalMarks] = useState('');
  const [collectedMarks, setCollectedMarks] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTest = { subject, totalMarks: parseInt(totalMarks), collectedMarks: parseInt(collectedMarks) };
    setTests([...tests, newTest]);
    // Add logic to save the test to Firebase
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block">Subject</label>
        <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} className="input-field" />
      </div>
      <div>
        <label className="block">Total Marks</label>
        <input type="number" value={totalMarks} onChange={(e) => setTotalMarks(e.target.value)} className="input-field" />
      </div>
      <div>
        <label className="block">Collected Marks</label>
        <input type="number" value={collectedMarks} onChange={(e) => setCollectedMarks(e.target.value)} className="input-field" />
      </div>
      <button type="submit" className="btn-primary">Add Test</button>
    </form>
  );
};

export default TestForm;
