import React, { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { getAllTeachers } from "../../backend/handleTeacher";
import AddTeacher from "./AddTeacher";
import AssignTeacher from "./AssignTeacher";
import DisplayStandards from "./DisplayStandards";
import { teachersAtom } from "../../state/teachersAtom";
import { stdSubAtom } from "../../state/stdSubAtom";

function ManageTeacherPage() {
  const setTeachers = useSetRecoilState(teachersAtom);
  const setStandards = useSetRecoilState(stdSubAtom);

  useEffect(() => {
    // Fetch and set teachers
    async function fetchTeachers() {
      const teachers = await getAllTeachers();
      setTeachers(teachers);
    }
    fetchTeachers();

    
  }, [setTeachers, setStandards]);

  return (
    <div>
      <AddTeacher />
      <AssignTeacher />
      <DisplayStandards />
    </div>
  );
}

export default ManageTeacherPage;
