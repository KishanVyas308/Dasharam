'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaChalkboardTeacher, FaClipboardList, FaChevronRight } from 'react-icons/fa';
import AddTest from "./AddTest";
import ManageTest from "./ManageTest";

export default function TestPage() {
  const [activeTab, setActiveTab] = useState<'add' | 'manage'>('add');

  return (
    <div className="min-h-screen py-6 px-4">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-7xl mx-auto"
      >
        <header className="bg-white shadow-md rounded-lg px-6 py-5 mb-8 border-l-4 border-indigo-600">
          <div className="flex items-center">
            <FaClipboardList className="text-3xl text-indigo-600 mr-4" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Test Management</h1>
              <p className="text-gray-600 mt-1">Create and manage tests, track student performance</p>
            </div>
          </div>
        </header>

        <div className="mb-6 flex flex-col sm:flex-row">
          <div className="bg-white rounded-lg shadow-md overflow-hidden sm:mr-4 mb-4 sm:mb-0">
            <nav className="sm:w-64 w-full">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Test Dashboard</h2>
              </div>
              <ul>
                <li>
                  <button
                    onClick={() => setActiveTab('add')}
                    className={`flex items-center justify-between w-full px-4 py-3 hover:bg-indigo-50 transition-colors ${
                      activeTab === 'add' ? 'bg-indigo-100 border-l-4 border-indigo-600' : ''
                    }`}
                  >
                    <div className="flex items-center">
                      <FaClipboardList className={`mr-3 ${activeTab === 'add' ? 'text-indigo-600' : 'text-gray-600'}`} />
                      <span className={activeTab === 'add' ? 'font-medium text-indigo-900' : 'text-gray-700'}>Create New Test</span>
                    </div>
                    {activeTab === 'add' && <FaChevronRight className="text-indigo-600" />}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('manage')}
                    className={`flex items-center justify-between w-full px-4 py-3 hover:bg-indigo-50 transition-colors ${
                      activeTab === 'manage' ? 'bg-indigo-100 border-l-4 border-indigo-600' : ''
                    }`}
                  >
                    <div className="flex items-center">
                      <FaChalkboardTeacher className={`mr-3 ${activeTab === 'manage' ? 'text-indigo-600' : 'text-gray-600'}`} />
                      <span className={activeTab === 'manage' ? 'font-medium text-indigo-900' : 'text-gray-700'}>View & Manage Tests</span>
                    </div>
                    {activeTab === 'manage' && <FaChevronRight className="text-indigo-600" />}
                  </button>
                </li>
              </ul>
            </nav>
          </div>

          <div className="flex-1">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              {activeTab === 'add' ? <AddTest /> : <ManageTest />}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
