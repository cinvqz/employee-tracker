INSERT INTO departments (name) VALUES ('Sales'), ('Engineering'), ('Finance');

-- Insert roles after departments to ensure department references are valid
INSERT INTO roles (title, salary, department) VALUES 
('Sales Manager', 80000, 1), 
('Salesperson', 50000, 1),
('Engineer', 90000, 2), 
('Finance Manager', 85000, 3);

-- Insert employees without managers first
INSERT INTO employees (first_name, last_name, role_id) VALUES 
('John', 'Doe', 1), 
('Jane', 'Smith', 2), 
('Peter', 'Jones', 3),
('Sarah', 'Brown', 4);

-- Update employees to set their manager IDs
UPDATE employees SET manager_id = 1 WHERE id = 2;
