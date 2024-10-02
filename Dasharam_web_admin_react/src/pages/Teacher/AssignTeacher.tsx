import React, { useState } from "react";
import { useRecoilState } from "recoil";
import { stdSubAtom } from "../../state/stdSubAtom";
import { teachersAtom } from "../../state/teachersAtom";
import { assignTeacherToSubject } from "../../backend/handleTeacher";

const AssignTeacher = () => {
  const [standardId, setStandardId] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [standards, setStandards] = useRecoilState(stdSubAtom);
  const [teachers] = useRecoilState(teachersAtom);

  const handleAssignTeacher = async () => {
    if (standardId && subjectName && teacherId) {
      await assignTeacherToSubject(standardId, subjectName, teacherId);
      alert("Teacher assigned successfully!");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-pbold text-primary my-4">Assign Teacher to Subject</h2>

      <select
        value={standardId}
        onChange={(e) => setStandardId(e.target.value)}
        className="w-full p-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-100"
      >
        <option value="" className="text-black-100">Select Standard</option>
        {standards.map((standard : any) => (
          <option key={standard.id} value={standard.id} className="text-black-100">
            {standard.name}
          </option>
        ))}
      </select>

      <select
        value={subjectName}
        onChange={(e) => setSubjectName(e.target.value)}
        className="w-full p-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-100"
      >
        <option value="" className="text-black-100">Select Subject</option>
        {standards
          .find((std : any) => std.id === standardId)
          ?.subjects.map((subject : any) => (
            <option key={subject.name} value={subject.name} className="text-black-100">
              {subject.name}
            </option>
          ))}
      </select>

      <select value={teacherId} onChange={(e) => setTeacherId(e.target.value)} className="w-full p-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-100">
        <option value="" className="text-black-100">Select Teacher</option>
        {teachers.map((teacher  :any) => (
          <option key={teacher.id} value={teacher.id} className="text-black-100">
            {teacher.name}
          </option>
        ))}
      </select>

      <button onClick={handleAssignTeacher} className="mt-3 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-100">Assign Teacher</button>
    </div>
  );
};

export default AssignTeacher;
