import React, { useState } from "react";
import { useRecoilState } from "recoil";
import { teachersAtom } from "../../state/teachersAtom";
import { addTeacher, deleteTeacher, getAllTeachers } from "../../backend/handleTeacher";

const AddTeacher = () => {
  const [name, setName] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [teachers, setTeachers] = useRecoilState(teachersAtom);

  const handleAddTeacher = async () => {
    if (name && mobileNo) {
      await addTeacher(name, mobileNo);
      const updatedTeachers = await getAllTeachers(); // Fetch updated teachers list
      setTeachers(updatedTeachers);
      setName("");
      setMobileNo("");
    }
  };

  const handleDeleteTeacher = async (teacherId: string) => {
    await deleteTeacher(teacherId);
    const updatedTeachers = await getAllTeachers(); // Fetch updated teachers list
    setTeachers(updatedTeachers);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-pbold text-primary my-4">Add Teacher</h2>
      <input
      className="w-full p-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-100"
        type="text"
        placeholder="Teacher Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
      className="w-full p-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-100"
        type="text"
        placeholder="Teacher Mobile No."
        value={mobileNo}
        onChange={(e) => setMobileNo(e.target.value)}
      />
      <button onClick={handleAddTeacher} className="mt-3 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-100">Add Teacher</button>

      <h3 className="text-xl font-pmedium text-black-200">Teacher List</h3>
      <ul className="space-y-4">
        {teachers.map((teacher : any) => (
          <li key={teacher.id} className="bg-gray-100 p-4 rounded-lg shadow-md">
            {teacher.name} - {teacher.mobileNo}

            <button onClick={() => handleDeleteTeacher(teacher.id)} className="ml-2 px-4 py-2 bg-red-500 text-white rounded-lg">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddTeacher;
