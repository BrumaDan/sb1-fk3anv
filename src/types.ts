export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  imageUrl: string;
}

export interface Node {
  id: string;
  type: 'employee';
  position: { x: number; y: number };
  data: Employee;
}