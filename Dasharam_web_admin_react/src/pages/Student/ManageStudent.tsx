import { useRecoilState } from "recoil";
import { studentsAtom } from "../../state/studentsAtom";
import { stdSubAtom } from "../../state/stdSubAtom";
import { useEffect, useState } from "react";
import { deleteStudent, getAllStudents } from "../../backend/handleStudent";
import { getAllStdSub } from "../../backend/subjectStdHandle";

const ManageStudent = () => {
  const [students, setStudents] = useRecoilState(studentsAtom);
  const [subjects, setSubjects] = useRecoilState(stdSubAtom);

  const [name, setName] = useState("" );
  const [parentName, setParentName] = useState("");
  const [parentMobileNo, setParentMobileNo] = useState("");
  const [grNo, setGrNo] = useState("");
  const [password, setPassword] = useState("");
  const [standardId, setStandardId] = useState("");



  useEffect(() => {
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
    fetchStudents();
  }, []);


  const handleDeleteStudent = async (studentId: string) => {
    await deleteStudent(studentId);
    const updatedStudents = await getAllStudents();
    setStudents(updatedStudents);
  } 

  // TODO: create one popup box where we can edit student detaills.
  // TODO: add functionality like by click on stdandard name open list of name of student and on click of name open that user detail and show edit, delete user.

  return (
    <div className="">
     
      <div className="container mx-auto p-4">
        <h2 className="text-3xl font-pbold text-primary my-4">Students</h2>
        {subjects.map((subject: any) => (
          <div key={subject.id} className="flex flex-col">
            {/* //TODO create a dropdown list for student which is related to standard */}
            <h3 className="text-xl font-pbold text-primary my-4">
              {subject.standard}
            </h3>
            <div className="flex flex-col gap-4">
              {subject.students.map((id: any) => (
                <div>
                  {students.find((student: any) => student.id === id)?.name}  
                  <button onClick={() => handleDeleteStudent(id)} className="bg-red-500 text-white px-4 py-2 rounded-lg">Delete</button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};



export default ManageStudent;
