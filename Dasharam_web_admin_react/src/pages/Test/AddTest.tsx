import { useState, useMemo } from "react";
import { useRecoilValue } from "recoil";
import { testsState } from "../../state/testsAtom";
import { teachersAtom } from "../../state/teachersAtom";
import { studentsAtom } from "../../state/studentsAtom";
import { stdSubAtom } from "../../state/stdSubAtom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AddTest = () => {
  const test = useRecoilValue(testsState);
  const teachers = useRecoilValue(teachersAtom);
  const students = useRecoilValue(studentsAtom);
  const stdSub = useRecoilValue(stdSubAtom);

  const [name, setName] = useState("");
  const [standardId, setStandardId] = useState("");
  const [subject, setSubject] = useState("");
  const [takenByTeacherId, setTakenByTeacherId] = useState("");
  const [totalMarks, setTotalMarks] = useState("0");
  const [takenDate, setTakenDate] = useState<Date | null>(null);
  const [selectedStdStudents, setSelectedStdStudents] = useState<any>([]);

  const filteredStudents = useMemo(() => {
    return students.filter((student: any) => student.standardId === standardId);
  }, [students, standardId]);

  const handleStdChange = (e: any) => {
    const selectedStdId = e.target.value;
    setStandardId(selectedStdId);

    const selectedStudents = students
      .filter((student: any) => student.standardId === selectedStdId)
      .map((student: any) => ({
        studentId: student.id,
        marks: "0",
      }));

    setSelectedStdStudents(selectedStudents);
  };

  const handleMarksChange = (studentId: string, newMarks: string) => {
    const updatedStudents = selectedStdStudents.map((student: any) =>
      student.studentId === studentId
        ? { ...student, marks: newMarks }
        : student
    );
    setSelectedStdStudents(updatedStudents);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8 mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Test</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input
          type="text"
          placeholder="Test Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-field"
        />

        <select
          value={standardId}
          onChange={handleStdChange}
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

        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="input-field"
        >
          <option value="" className="text-gray-400">
            Select Subject
          </option>
          {stdSub
            .find((std: any) => std.id === standardId)
            ?.subjects.map((sub: any) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
        </select>

        <select
          value={takenByTeacherId}
          onChange={(e) => setTakenByTeacherId(e.target.value)}
          className="input-field"
        >
          <option value="" className="text-gray-400">
            Select Teacher
          </option>
          {teachers.map((teacher: any) => (
            <option key={teacher.id} value={teacher.id}>
              {teacher.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Total Marks"
          value={totalMarks}
          onFocus={(e) => e.target.select()}
          onChange={(e) => setTotalMarks(e.target.value)}
          className="input-field"
        />

        <DatePicker
          selected={takenDate}
          onChange={(date: Date | null) => setTakenDate(date)}
          placeholderText="Select Date"
          className="input-field"
          dateFormat="dd/MM/yyyy"
        />
      </div>

      <h3 className="text-xl font-semibold text-gray-700 mt-8 mb-4">
        Assign Marks to Students
      </h3>

      <div className="space-y-4">
        {filteredStudents.map((student: any) => (
          <div
            key={student.id}
            className="flex items-center justify-between bg-gray-50 rounded-lg p-4"
          >
            <span className="text-gray-600">{student.name}</span>
            <div>
            {totalMarks } <span className="text-black-200 text-[20px]"> / </span> 
            <input
              type="number"
              value={
                selectedStdStudents.find((s: any) => s.studentId === student.id)
                ?.marks || ""
              }
              onFocus={(e) => e.target.select()}
              onChange={(e) => handleMarksChange(student.id, e.target.value)}
              className={`w-20 p-2 rounded-md border border-gray-300 focus:outline-none focus:border-indigo-500  `}
              />
              </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={() => {
            console.log({
              name,
              standardId,
              subject,
              takenByTeacherId,
              totalMarks,
              takenDate,
              selectedStdStudents,
            });
          }}
          className="btn-primary"
        >
          Add Test
        </button>
      </div>
    </div>
  );
};

export default AddTest;
