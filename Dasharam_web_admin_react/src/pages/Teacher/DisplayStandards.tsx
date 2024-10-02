import React from "react";
import { useRecoilValue } from "recoil";
import { stdSubAtom } from "../../state/stdSubAtom";

const DisplayStandards = () => {
  const standards = useRecoilValue(stdSubAtom);

  return (
    <div className="">
      <h2 className="text-2xl font-bold">Standards</h2>
      {standards.map((standard : any) => (
        <div key={standard.id} className="p-4 bg-gray-100 rounded-lg">
          <h3 className="text-xl font-bold">{standard.name}</h3>
          <ul className="list-disc ml-4 mt-2">
            {standard.subjects.map((subject : any) => (
              <li key={subject.name} className="text-sm">
                {subject.name} - Assigned Teacher: {subject.teacherId || "None"}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default DisplayStandards;
