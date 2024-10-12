import { useRecoilState } from "recoil";
import { studentsAtom } from "../../state/studentsAtom";
import { stdSubAtom } from "../../state/stdSubAtom";
import { useEffect, useState } from "react";
import { deleteStudent, getAllStudents } from "../../backend/handleStudent";
import { getAllStdSub } from "../../backend/subjectStdHandle";

const ManageStudent = () => {
  const [students, setStudents] = useRecoilState(studentsAtom);
  const [subjects, setSubjects] = useRecoilState(stdSubAtom);

  const [name, setName] = useState("");
  const [parentName, setParentName] = useState("");
  const [parentMobileNo, setParentMobileNo] = useState("");
  const [grNo, setGrNo] = useState("");
  const [password, setPassword] = useState("");
  const [standardId, setStandardId] = useState("");

  async function fetchStudents() {
    if (students.length === 0) {
      const data = await getAllStudents();
      setStudents(data);
    }
    if (subjects.length === 0) {
      const data = await getAllStdSub();
      setSubjects(data);
    }
  }

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDeleteStudent = async (studentId: string, subjectId: string) => {
    await deleteStudent(studentId, subjectId);
    const updatedStudents = await getAllStudents();
    setStudents(updatedStudents);
    const updatedSubjects = await getAllStdSub();
    setSubjects(updatedSubjects);
  };

  return (
    <div className="container mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-4xl font-bold text-primary mb-6">Manage Students</h2>
      {subjects.map((subject: any) => (
        <div key={subject.id} className="mb-8">
          <h3 className="text-2xl font-semibold text-secondary mb-4">
            {subject.standard}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subject.students.map((id: any) => {
              const student = students.find((student: any) => student.id === id);
              return (
                <div key={id} className="bg-gray-100 p-4 rounded-lg shadow-md flex justify-between items-center">
                  <span className="text-lg font-medium">{student?.name}</span>
                  <button
                    onClick={() => handleDeleteStudent(id, subject.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
                  >
                    Delete
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ManageStudent;
