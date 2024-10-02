import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { stdSubAtom } from "../../state/stdSubAtom";
import {
  addStandard,
  getAllStdSub,
  addSubjectsInStandard,
  updateStandardName,
  removeSubjectFromStandard,
  deleteStandard,
} from "../../backend/subjectStdHandle";

const SubjectStdPage = () => {
  const [stdSubState, setStdSubState] = useRecoilState<any>(stdSubAtom);
  const [newStandardName, setNewStandardName] = useState("");
  const [editStandardName, setEditStandardName] = useState<{
    [key: string]: string;
  }>({});
  const [newSubjects, setNewSubjects] = useState<{ [key: string]: string }>({});
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
  const [subjectToRemove, setSubjectToRemove] = useState<string | null>(null);

  const setUp = async () => {
    const allStdSub = await getAllStdSub();
    if (allStdSub) {
      setStdSubState(allStdSub);
    }
  };

  const handleAddStandard = async () => {
    if (newStandardName.trim() === "") return;
    const success = await addStandard(newStandardName.trim());
    if (success) {
      setNewStandardName("");
      setUp();
    }
  };

  const handleUpdateStandardName = async (standardId: string) => {
    const newName = editStandardName[standardId];
    if (!newName || newName.trim() === "") return;
    await updateStandardName(standardId, newName);
    setEditMode((prev) => ({ ...prev, [standardId]: false }));
    setUp();
  };

  const handleAddSubjects = async (standardId: string) => {
    // Split and trim the new subjects entered by the user
    const subjects = newSubjects[standardId]?.split(",").map((sub) => sub.trim());
    
    if (!subjects || subjects.length === 0) return; // Check if subjects are valid
  
    // Add new subjects and fetch the updated list
    await addSubjectsInStandard(standardId, subjects);
  
    // Reset input field and update the state
    setNewSubjects((prev) => ({ ...prev, [standardId]: "" }));
    setUp(); // Assuming this is a state update or UI refresh function
  };
  
  const handleRemoveSubject = async (standardId: string, subject: string) => {
    await removeSubjectFromStandard(standardId, subject);
    setSubjectToRemove(null);
    setUp();
  };

  const handleDeleteStandard = async (standardId: string) => {
    await deleteStandard(standardId);
    setUp();
  };

  useEffect(() => {
    setUp();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-pbold text-primary my-4">
        Manage Standards and Subjects
      </h1>

      {/* Add Standard Section */}
      <div className="mb-6">
        <h3 className="text-xl font-pmedium text-black-200">
          Add a New Standard
        </h3>
        <input
          type="text"
          className="w-full p-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-100"
          placeholder="Enter standard name"
          value={newStandardName}
          onChange={(e) => setNewStandardName(e.target.value)}
        />
        <button
          className="mt-3 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-100"
          onClick={handleAddStandard}
        >
          Add Standard
        </button>
      </div>

      {/* Display Standards */}
      <div>
        <h3 className="text-xl font-pmedium text-black-200">Standards List</h3>
        <ul className="space-y-4">
          {stdSubState.map((standard: any) => (
            <li
              key={standard.id}
              className="bg-gray-100 p-4 rounded-lg shadow-md"
            >
              <div className="flex justify-between items-center">
                {/* Edit Standard Name */}
                {editMode[standard.id] ? (
                  <input
                    type="text"
                    value={editStandardName[standard.id] || ""}
                    onChange={(e) =>
                      setEditStandardName((prev) => ({
                        ...prev,
                        [standard.id]: e.target.value,
                      }))
                    }
                    className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-100"
                  />
                ) : (
                  <h5 className="text-lg font-pmedium text-black-100">
                    {standard.standard}
                  </h5>
                )}

                <div>
                  {editMode[standard.id] ? (
                    <>
                      <button
                        className="px-4 py-2 bg-green-500 text-white rounded-lg"
                        onClick={() => handleUpdateStandardName(standard.id)}
                      >
                        Save
                      </button>
                      <button
                        className="ml-2 px-4 py-2 bg-gray-400 text-white rounded-lg"
                        onClick={() =>
                          setEditMode((prev) => ({
                            ...prev,
                            [standard.id]: false,
                          }))
                        }
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      className="px-4 py-2 bg-yellow-400 text-white rounded-lg"
                      onClick={() =>
                        setEditMode((prev) => ({
                          ...prev,
                          [standard.id]: true,
                        }))
                      }
                    >
                      Edit
                    </button>
                  )}
                  <button
                    className="ml-2 px-4 py-2 bg-red-500 text-white rounded-lg"
                    onClick={() => handleDeleteStandard(standard.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Subjects */}
              <p className="mt-2 text-gray-600">
                Subjects: {standard.subjects?.join(", ") || "None"}
              </p>

              {/* Add Subjects */}
              <div className="mt-3">
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-100"
                  placeholder="Add subjects (comma-separated)"
                  value={newSubjects[standard.id] || ""}
                  onChange={(e) =>
                    setNewSubjects((prev) => ({
                      ...prev,
                      [standard.id]: e.target.value,
                    }))
                  }
                />
                <button
                  className="mt-2 px-4 py-2 bg-gray-700 text-white rounded-lg"
                  onClick={() => handleAddSubjects(standard.id)}
                >
                  Add Subjects
                </button>
              </div>

              {/* Remove Subjects */}
              {standard.subjects && (
                <div className="mt-2">
                  <h6 className="text-sm font-pmedium text-black-200">
                    Remove Subject
                  </h6>
                  {standard.subjects.map((subject: string) => (
                    <button
                      key={subject}
                      className="px-4 py-1 mt-1 mr-2 bg-red-100 text-red-500 rounded-lg hover:bg-red-200"
                      onClick={() => handleRemoveSubject(standard.id, subject)}
                    >
                      {subject} &times;
                    </button>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SubjectStdPage;
