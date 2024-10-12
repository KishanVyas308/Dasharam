import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { teastsAtom } from '../../state/testsAtom';
import { stdSubAtom } from '../../state/stdSubAtom';
import { studentsAtom } from '../../state/studentsAtom';

const ManageTest = () => {
  const test = useRecoilValue(teastsAtom);
  const stdSub = useRecoilValue(stdSubAtom);
  const students = useRecoilValue(studentsAtom);
  const [selectedStd, setSelectedStd] = useState("");  
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (test: any) => {
    setSelectedTest(test);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTest(null);
  };

  return (
    <div>
      <div className="flex">
        <div className="w-1/4 p-4">
          <h2 className="text-xl font-bold mb-4">Standards</h2>
          <select
            value={selectedStd}
            onChange={(e) => setSelectedStd(e.target.value)}
            className="input-field"
          >
            <option value="" className="text-gray-400">
              Select Standard
            </option>
            {stdSub.map((std: any) => (
              <option key={std.id} value={std.id}>
                {std.standard}
              </option>
            ))}
          </select>
        </div>
        <div className="w-3/4 p-4">
          {selectedStd && (
            <>
              <h2 className="text-xl font-bold mb-4">Tests</h2>
              <ul>
                {test
                  .filter((t: any) => t.standardId === selectedStd)
                  .map((t: any) => (
                    <li key={t.id} className="mb-2">
                      <button
                        className="text-blue-500 hover:underline"
                        onClick={() => openModal(t)}
                      >
                        {t.name} - {t.subject} - {(t.takenDate).slice(0, 10)} - {t.totalMarks}
                      </button>
                    </li>
                  ))}
              </ul>
            </>
          )}
        </div>
      </div>

      {isModalOpen && selectedTest && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
            <h2 className="text-2xl font-bold mb-4">{selectedTest.name}</h2>
            <p className="mb-2">Subject: {selectedTest.subject}</p>
            <p className="mb-2">Date: {(selectedTest.takenDate).slice(0, 10)}</p>
            <p className="mb-4">Total Marks: {selectedTest.totalMarks}</p>
            <h3 className="text-xl font-bold mb-2">Students</h3>
            <ul>
              {selectedTest.students.map((student: any) => (
                <li key={student.id} className="mb-2">
                  {students.find((s: any) => s.id === student.studentId).name} - {student.marks} / {selectedTest.totalMarks}
                </li>
              ))}
            </ul>
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTest;
