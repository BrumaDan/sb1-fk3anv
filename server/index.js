import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const db = new Database(join(__dirname, 'orgchart.db'));

const app = express();
app.use(cors());
app.use(express.json());

// Initialize database tables
db.exec(`
  CREATE TABLE IF NOT EXISTS employees (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    position TEXT NOT NULL,
    department TEXT NOT NULL,
    email TEXT NOT NULL,
    imageUrl TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS relationships (
    id TEXT PRIMARY KEY,
    source TEXT NOT NULL,
    target TEXT NOT NULL,
    FOREIGN KEY (source) REFERENCES employees (id),
    FOREIGN KEY (target) REFERENCES employees (id)
  );
`);

// Get all organization data
app.get('/api/org', (req, res) => {
  const employees = db.prepare('SELECT * FROM employees').all();
  const relationships = db.prepare('SELECT * FROM relationships').all();
  res.json({ employees, relationships });
});

// Add or update employee
app.post('/api/employees', (req, res) => {
  const { id, name, position, department, email, imageUrl } = req.body;
  
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO employees (id, name, position, department, email, imageUrl)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  
  stmt.run(id, name, position, department, email, imageUrl);
  res.json({ success: true, id });
});

// Delete employee
app.delete('/api/employees/:id', (req, res) => {
  const { id } = req.params;
  
  db.prepare('DELETE FROM relationships WHERE source = ? OR target = ?').run(id, id);
  db.prepare('DELETE FROM employees WHERE id = ?').run(id);
  
  res.json({ success: true });
});

// Add relationship
app.post('/api/relationships', (req, res) => {
  const { id, source, target } = req.body;
  
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO relationships (id, source, target)
    VALUES (?, ?, ?)
  `);
  
  stmt.run(id, source, target);
  res.json({ success: true, id });
});

// Delete relationship
app.delete('/api/relationships/:id', (req, res) => {
  const { id } = req.params;
  
  db.prepare('DELETE FROM relationships WHERE id = ?').run(id);
  
  res.json({ success: true });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});