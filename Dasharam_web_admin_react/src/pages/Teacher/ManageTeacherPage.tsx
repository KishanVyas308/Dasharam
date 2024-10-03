import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { getAllTeachers } from "../../backend/handleTeacher";
import AddTeacher from "./AddTeacher";
import AssignTeacher from "./AssignTeacher";
import { teachersAtom } from "../../state/teachersAtom";
import { stdSubAtom } from "../../state/stdSubAtom";
import { getAllStdSub } from "../../backend/subjectStdHandle";

function ManageTeacherPage() {
  const [teachers, setTeachers] = useRecoilState(teachersAtom);
  const [standards, setStandards] = useRecoilState(stdSubAtom);

  useEffect(() => {
    // Fetch and set teachers
    async function fetchTeachers() {
      if (teachers.length === 0) {
        const data = await getAllTeachers();
        setTeachers(data);
      }
      console.log(teachers);
    }

    async function fetchStandardsSub() {
      if (standards.length === 0) {
        const data = await getAllStdSub();
        setStandards(data);
      }
      console.log(standards);
    }
    fetchTeachers();
    fetchStandardsSub();
  }, [setTeachers, setStandards]);

  return (
    <div>
      <AddTeacher />
      <AssignTeacher />
    </div>
  );
}

export default ManageTeacherPage;
