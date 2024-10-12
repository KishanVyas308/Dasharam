import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { stdSubAtom } from "../../state/stdSubAtom";
import {
  addStandard,
  addSubjectsInStandard,
  deleteStandard,
  getAllStdSub,
  removeSubjectFromStandard,
  updateStandardName,
} from "../../backend/subjectStdHandle";
import { teachersAtom } from "../../state/teachersAtom";
import { getAllTeachers } from "../../backend/handleTeacher";

const TestSubjectStdPage = () => {
  const [stdSubState, setStdSubState] = useRecoilState<any>(stdSubAtom);
  const [teachers, setTeachers] = useRecoilState(teachersAtom);

  const [addStdText, setAddStdText] = useState("");
  const [addSubjTexts, setAddSubjTexts] = useState<any>([]);

  const [isEditStdName, setIsEditStdName] = useState(false);
  const [editStdName, setEditStdName] = useState("");
  const [editStdId, setEditStdId] = useState("");

  async function setUp() {
    const allStdSub = await getAllStdSub();
    if (allStdSub) {
      setStdSubState(allStdSub);
    }
    const allTeachers = await getAllTeachers();
    if (allTeachers) {
      setTeachers(allTeachers);
    }
    console.log(allStdSub);
  }

  async function handleAddStandard() {
    const success = await addStandard(addStdText);
    if (success) {
      setAddStdText("");
      setUp();
    }
  }

  async function handeUpdateStandardName(standardId: string) {
    await updateStandardName(standardId, editStdName);
    setIsEditStdName(false);
    setUp();
  }

  async function handleDeleteStandard(standardId: string) {
    await deleteStandard(standardId);
    setUp();
  }

  async function handleAddStandardSubjects(standardId: string, subjects: string) {
    const newSubjects = subjects.split(",").map((name: string) => ({ name }));
    await addSubjectsInStandard(standardId, newSubjects);
    setAddSubjTexts((prev: any) => ({ ...prev, [standardId]: "" }));
    setAddStdText("");
    setUp();
  }

  async function handleDeleteSubject(standardId: string, subjectName: string) {
    await removeSubjectFromStandard(standardId, subjectName);
    setUp();
  }

  useEffect(() => {
    setUp();
  }, []);

  return (
    <div className="container mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-4xl font-bold text-primary mb-6">Manage Standards and Subjects</h1>
      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">Add a New Standard</h3>
        <div className="flex space-x-4">
          <input
            type="text"
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter standard name"
            value={addStdText}
            onChange={(e) => setAddStdText(e.target.value)}
          />
          <button
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition duration-300"
            onClick={() => {
              setAddSubjTexts((prev: any) => ({ ...prev, [addStdText]: "" }));
              setAddStdText("");
              handleAddStandard();
            }}
          >
            Add Standard
          </button>
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">Standards List</h3>
        <ul className="space-y-4">
          {stdSubState.map((standard: any) => (
            <li key={standard.id} className="bg-gray-100 p-6 rounded-lg shadow-md">
              {isEditStdName && standard.id === editStdId ? (
                <div className="flex justify-between items-center mb-4">
                  <input
                    type="text"
                    value={editStdName}
                    onChange={(e) => setEditStdName(e.target.value)}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <div className="flex space-x-2">
                    <button
                      className="px-4 py-2 bg-green-500 text-white rounded-lg"
                      onClick={() => {
                        handeUpdateStandardName(standard.id);
                      }}
                    >
                      Save
                    </button>
                    <button
                      className="px-4 py-2 bg-gray-400 text-white rounded-lg"
                      onClick={() => {
                        setIsEditStdName(false);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center mb-4">
                  <h5 className="text-lg font-semibold text-gray-800">{standard.standard}</h5>
                  <div className="flex space-x-2">
                    <button
                      className="px-4 py-2 bg-green-500 text-white rounded-lg"
                      onClick={() => {
                        setIsEditStdName(true);
                        setEditStdName(standard.standard);
                        setEditStdId(standard.id);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="px-4 py-2 bg-red-500 text-white rounded-lg"
                      onClick={() => {
                        handleDeleteStandard(standard.id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Add subjects (comma-separated)"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  value={addSubjTexts[standard.id]}
                  onChange={(e) => setAddSubjTexts((prev: any) => ({ ...prev, [standard.id]: e.target.value }))}
                />
                <button
                  className="mt-3 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition duration-300"
                  onClick={() => handleAddStandardSubjects(standard.id, addSubjTexts[standard.id])}
                >
                  Add Subjects
                </button>
              </div>
              <div>
                {standard.subjects.map((subject: any) => (
                  <div key={subject.name} className="flex justify-between items-center mb-2">
                    <div>
                      <span className="font-medium text-gray-800">{subject.name}</span> - taken by{" "}
                      {subject.teacherIds?.map((id: string) => (
                        <span key={id} className="text-gray-600 font-semibold">
                          {teachers.find((teacher: any) => teacher.id === id)?.name + ", "}
                        </span>
                      ))}
                    </div>
                    <button
                      className="px-4 py-2 bg-red-500 text-white rounded-lg"
                      onClick={() => {
                        handleDeleteSubject(standard.id, subject.name);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TestSubjectStdPage;
