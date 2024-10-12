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

    async function fetchStandardsSub() {
        if (standard.length === 0) {
            const data = await getAllStdSub();
            setStandard(data);
        }
        console.log(standard);
    }

    useEffect(() => {
        fetchStandardsSub();
    }, [standard]);

    const handleAddStudent = async () => {
        if (name && parentName && parentMobileNo && grNo && password && standardId) {
            await addStudent(name, parentName, parentMobileNo, grNo, password, standardId);
            const updatedStudents: any = await getAllStudents(); // Fetch updated students list
            setStudents(updatedStudents);
            setName("");
            setParentName("");
            setParentMobileNo("");
            setGrNo("");
            setPassword("");
            setStandardId("");
        }
        fetchStandardsSub();
    };

    return (
        <div className="container mx-auto p-8 bg-white shadow-lg rounded-lg">
            <h2 className="text-4xl font-bold text-primary mb-6">Add Student</h2>
            <div className="grid grid-cols-1 gap-6">
                <input
                    type="text"
                    placeholder="Student Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                    type="text"
                    placeholder="Student Parent Name"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                    type="text"
                    placeholder="Student Parent Mobile No."
                    value={parentMobileNo}
                    onChange={(e) => setParentMobileNo(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                    type="text"
                    placeholder="Student GR No."
                    value={grNo}
                    onChange={(e) => setGrNo(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                    type="password"
                    placeholder="Student Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <select
                    value={standardId}
                    onChange={(e) => setStandardId(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    <option value="" className="text-gray-500">Select Standard</option>
                    {standard.map((std: any) => (
                        <option key={std.id} value={std.id} className="text-gray-900">
                            {std.standard}
                        </option>
                    ))}
                </select>
                <button
                    onClick={handleAddStudent}
                    className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition duration-300"
                >
                    Add Student
                </button>
            </div>
        </div>
    );
};

export default AddStudent;
