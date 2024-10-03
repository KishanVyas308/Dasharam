import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { studentsAtom } from "../../state/studentsAtom";
import { addStudent, deleteStudent, getAllStudents } from "../../backend/handleStudent";
import { stdSubAtom } from "../../state/stdSubAtom";
import { getAllStdSub } from "../../backend/subjectStdHandle";


const AddStudent = () => {
    const [name, setName] = useState("");
    const [parentName, setParentName] = useState("");
    const [parentMobileNo, setParentMobileNo] = useState("");
    const [grNo, setGrNo] = useState("");
    const [password, setPassword] = useState("");
    const [standardId, setStandardId] = useState("");

    const [students, setStudents] = useRecoilState(studentsAtom);


    const [standard, setStandard] = useRecoilState(stdSubAtom);

    useEffect(() => {
        async function fetchStandardsSub() {
            if (standard.length === 0) {
                const data = await getAllStdSub();
                setStandard(data);
            }
            console.log(standard);
        }
        fetchStandardsSub();
    }, [standard]);


    const handleAddStudent = async () => {
        if (name && parentName && parentMobileNo && grNo && password && standardId) {
            await addStudent(name, parentName, parentMobileNo, grNo, password, standardId);
            const updatedStudents : any = await getAllStudents(); // Fetch updated students list
            setStudents(updatedStudents);
            setName("");
            setParentName("");
            setParentMobileNo("");
            setGrNo("");
            setPassword("");
            setStandardId("");
        }
    }

  return (
    <div className="container mx-auto p-4">
        <h2 className="text-3xl font-pbold text-primary my-4">Add Student</h2>
        <input type="text" placeholder="Student Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-100" />
        <input type="text" placeholder="Student Parent Name" value={parentName} onChange={(e) => setParentName(e.target.value)} className="w-full p-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-100" />
        <input type="text" placeholder="Student Parent Mobile No." value={parentMobileNo} onChange={(e) => setParentMobileNo(e.target.value)} className="w-full p-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-100" />
        <input type="text" placeholder="Student GR No." value={grNo} onChange={(e) => setGrNo(e.target.value)}  className="w-full p-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-100" />
        <input type="password" placeholder="Student Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-100" />
        <select value={standardId} onChange={(e) => setStandardId(e.target.value)} className="w-full p-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-100">
            <option value="" className="text-black-100">Select Standard</option>
            {standard.map((std: any) => (
                <option key={std.id} value={std.id} className="text-black-100">
                    {std.standard}
                </option>
            ))}
        </select>
        <button onClick={handleAddStudent} className="mt-3 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-100">Add Student</button>
    </div>
  )
}

export default AddStudent
      
