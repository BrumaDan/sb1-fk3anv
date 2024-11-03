import { create } from 'zustand';
import { Node, Employee } from './types';

interface Edge {
  id: string;
  source: string;
  target: string;
}

interface OrgState {
  nodes: Node[];
  edges: Edge[];
  addEmployee: (employee: Employee) => void;
  updateEmployee: (id: string, employee: Employee) => void;
  removeEmployee: (id: string) => void;
  updateNodePosition: (id: string, position: { x: number; y: number }) => void;
  addEdge: (edge: Edge) => void;
  removeEdge: (id: string) => void;
  loadOrgData: () => Promise<void>;
}

const API_URL = 'http://localhost:3000/api';

export const useOrgStore = create<OrgState>((set, get) => ({
  nodes: [],
  edges: [],

  loadOrgData: async () => {
    try {
      const response = await fetch(`${API_URL}/org`);
      const data = await response.json();
      
      const nodes = data.employees.map((emp: Employee) => ({
        id: emp.id,
        type: 'employee',
        position: { x: Math.random() * 500, y: Math.random() * 500 },
        data: emp
      }));

      set({ 
        nodes,
        edges: data.relationships
      });
    } catch (error) {
      console.error('Failed to load organization data:', error);
    }
  },

  addEmployee: async (employee) => {
    try {
      await fetch(`${API_URL}/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employee)
      });

      set((state) => ({
        nodes: [
          ...state.nodes,
          {
            id: employee.id,
            type: 'employee',
            position: { x: 400, y: 200 },
            data: employee
          }
        ]
      }));
    } catch (error) {
      console.error('Failed to add employee:', error);
    }
  },

  updateEmployee: async (id, employee) => {
    try {
      await fetch(`${API_URL}/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...employee, id })
      });

      set((state) => ({
        nodes: state.nodes.map((node) =>
          node.id === id ? { ...node, data: employee } : node
        )
      }));
    } catch (error) {
      console.error('Failed to update employee:', error);
    }
  },

  removeEmployee: async (id) => {
    try {
      await fetch(`${API_URL}/employees/${id}`, {
        method: 'DELETE'
      });

      set((state) => ({
        nodes: state.nodes.filter((node) => node.id !== id),
        edges: state.edges.filter(
          (edge) => edge.source !== id && edge.target !== id
        )
      }));
    } catch (error) {
      console.error('Failed to remove employee:', error);
    }
  },

  updateNodePosition: (id, position) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id ? { ...node, position } : node
      )
    })),

  addEdge: async (edge) => {
    try {
      await fetch(`${API_URL}/relationships`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(edge)
      });

      set((state) => ({
        edges: [...state.edges, edge]
      }));
    } catch (error) {
      console.error('Failed to add relationship:', error);
    }
  },

  removeEdge: async (id) => {
    try {
      await fetch(`${API_URL}/relationships/${id}`, {
        method: 'DELETE'
      });

      set((state) => ({
        edges: state.edges.filter((edge) => edge.id !== id)
      }));
    } catch (error) {
      console.error('Failed to remove relationship:', error);
    }
  }
}));