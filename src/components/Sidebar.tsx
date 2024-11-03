import React, { useState } from 'react';
import { Plus, UserPlus } from 'lucide-react';
import { useOrgStore } from '../store';
import EmployeeForm from './EmployeeForm';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-4 right-4 z-50 p-3 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-transform ${
          isOpen ? 'rotate-45' : ''
        }`}
      >
        <Plus className="w-6 h-6" />
      </button>

      <div
        className={`fixed right-0 top-0 h-full w-80 bg-white shadow-lg transform transition-transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } z-40`}
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-6">Organization Controls</h2>
          
          <button
            onClick={() => setIsFormOpen(true)}
            className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <UserPlus className="w-5 h-5" />
            <span>Add New Employee</span>
          </button>
        </div>
      </div>

      {isFormOpen && (
        <EmployeeForm onClose={() => setIsFormOpen(false)} />
      )}
    </>
  );
}