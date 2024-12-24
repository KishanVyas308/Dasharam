"use client";

// import { getAllTests } from "../../backend/handleTest";
import AddTest from "./AddTest";
import ManageTest from "./ManageTest";

export default function TestPage() {


  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">



      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">


        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-8">
              <AddTest />
              <ManageTest />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
