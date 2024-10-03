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
    setAddSubjTexts((prev  :any) => ({ ...prev, [standardId]: "" }));
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
    <div>
      <div>
        <h1 className="text-3xl font-pbold text-primary my-4">
          Manage Standards and Subjects
        </h1>
        <div className="mb-6">
          <h3 className="text-xl font-pmedium text-black-200">
            Add a New Standard
          </h3>
          <input
            type="text"
            className="w-full p-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-100"
            placeholder="Enter standard name"
            value={addStdText}
            onChange={(e) => setAddStdText(e.target.value)}
          />
          <button
            className="mt-3 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-100"
            onClick={() => {
             
              setAddSubjTexts((prev  :any) => ({ ...prev, [addStdText]: "" }));
              setAddStdText("");
              handleAddStandard();
            }}
          >
            Add Standard
          </button>
        </div>
        <div>
          <h3 className="text-xl font-pmedium text-black-200">
            Standards List
          </h3>
          <ul className="space-y-4">
            {stdSubState.map((standard: any) => (
              <li
                key={standard.id}
                className="bg-gray-100 p-4 rounded-lg shadow-md"
              >
                {isEditStdName && standard.id === editStdId ? (
                  <div className="flex justify-between items-center">
                    <input
                      type="text"
                      value={editStdName}
                      onChange={(e) => setEditStdName(e.target.value)}
                      className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-100"
                    />
                    <div>
                      <button
                        className="px-4 py-2 bg-green-500 text-white rounded-lg"
                        onClick={() => {
                          handeUpdateStandardName(standard.id);
                        }}
                      >
                        Save
                      </button>
                      <button
                        className="ml-2 px-4 py-2 bg-gray-400 text-white rounded-lg"
                        onClick={() => {
                          setIsEditStdName(false);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <h5 className="text-lg font-pmedium text-black-100">
                      {standard.standard} 
                    </h5>
                    <div>
                    {standard.subjects.length} Subjects 
                    </div>
                    <div>
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
                        className="ml-2 px-4 py-2 bg-red-500 text-white rounded-lg"
                        onClick={() => {
                          handleDeleteStandard(standard.id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
          {/* //add subjects */}
               <div>
                <input type="text" name="" id="" placeholder="Add subjects (comma-separated)"  
                className="w-[300px] p-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-100"
                  value={addSubjTexts[standard.id]}
                  onChange={(e) => setAddSubjTexts((prev  :any) => ({ ...prev, [standard.id]: e.target.value }))}
                />
                <button className="mt-3 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-100"
                 onClick={ () => handleAddStandardSubjects(standard.id, addSubjTexts[standard.id]) }>
                  Add subjects
                </button>
               </div>

                <div>
                  {standard.subjects.map((subject: any) => (
                    <div key={subject.name}>
                      {subject.name} - taken by{" "}
                      {subject.teacherIds?.map((id: string) => (
                        <span key={id} className="text-black-100 test font-semibold">
                          {
                            teachers.find((teacher: any) => teacher.id === id)
                              ?.name 
                               + " , "
                          }
                        </span>
                      ))}
                     
                        
                      <button
                        className="ml-2 px-4 py-2 bg-red-500 text-white rounded-lg"
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
    </div>
  );
};

export default TestSubjectStdPage;
