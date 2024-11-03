import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Mail, Building2, Briefcase, Edit, Trash2 } from 'lucide-react';
import { useOrgStore } from '../store';
import EmployeeForm from './EmployeeForm';

interface EmployeeNodeProps {
  data: {
    id: string;
    name: string;
    position: string;
    department: string;
    email: string;
    imageUrl: string;
  };
}

export default function EmployeeNode({ data }: EmployeeNodeProps) {
  const [isEditing, setIsEditing] = useState(false);
  const removeEmployee = useOrgStore((state) => state.removeEmployee);

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-4 w-64 relative group">
        <Handle 
          type="target" 
          position={Position.Top} 
          className="w-3 h-3 !bg-blue-500 transition-all group-hover:!w-4 group-hover:!h-4" 
        />
        <div className="flex items-center space-x-4">
          <img
            src={data.imageUrl}
            alt={data.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-lg">{data.name}</h3>
            <div className="flex items-center text-gray-600 text-sm">
              <Briefcase className="w-4 h-4 mr-1" />
              {data.position}
            </div>
          </div>
        </div>
        <div className="mt-4 space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <Building2 className="w-4 h-4 mr-2" />
            {data.department}
          </div>
          <div className="flex items-center">
            <Mail className="w-4 h-4 mr-2" />
            {data.email}
          </div>
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 hover:bg-gray-100 rounded"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => removeEmployee(data.id)}
            className="p-1 hover:bg-gray-100 rounded text-red-600"
            title="Remove"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        <Handle 
          type="source" 
          position={Position.Bottom} 
          className="w-3 h-3 !bg-blue-500 transition-all group-hover:!w-4 group-hover:!h-4" 
        />
      </div>
      {isEditing && (
        <EmployeeForm
          employee={data}
          onClose={() => setIsEditing(false)}
        />
      )}
    </>
  );
}