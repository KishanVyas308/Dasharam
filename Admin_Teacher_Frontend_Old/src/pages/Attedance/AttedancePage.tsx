import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { getAllTeachers } from "../../backend/handleTeacher";
import { getAllStdSub } from "../../backend/subjectStdHandle";
import AddAttedance from "./AddAttedance";
import { teachersAtom } from "../../state/teachersAtom";
import { stdSubAtom } from "../../state/stdSubAtom";
import { studentsAtom } from "../../state/studentsAtom";
import { getAllStudents } from "../../backend/handleStudent";

const AttedancePage = () => {
  const [teachers, setTeachers] = useRecoilState(teachersAtom);
  const [stdSubjects, setStdSubjects] = useRecoilState(stdSubAtom);
  const [students, setStudents] = useRecoilState(studentsAtom);

  useEffect(() => {
    if (teachers.length === 0) {
      getAllTeachers().then((data) => {
        setTeachers(data);
      });
    }
    if (stdSubjects.length === 0) {
      getAllStdSub().then((data) => {
        setStdSubjects(data);
      });
    }
    if (students.length === 0) {
      getAllStudents().then((data) => {
        if (data)
          setStudents(data);
        else setStudents([]);
      });
    }
  }, []);
  return <div className="">
    <AddAttedance />
  </div>;
};

export default AttedancePage;
