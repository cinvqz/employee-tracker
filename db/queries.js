const { Client } = require('pg');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'employees_db',
    password: 'april99',
    port: 5432,
});

client.connect();

const getDepartments = async () => {
    const res = await client.query('SELECT * FROM departments');
    return res.rows;
};

const getRoles = async () => {
    const res = await client.query(`
        SELECT roles.*, departments.name AS department 
        FROM roles 
        JOIN departments ON roles.department = departments.id
    `);
    return res.rows;
};

const getEmployees = async () => {
    const res = await client.query(`
        SELECT employees.*, roles.title AS role, roles.salary, departments.name AS department, 
        (SELECT CONCAT(first_name, ' ', last_name) FROM employees WHERE id = employees.manager_id) AS manager 
        FROM employees 
        JOIN roles ON employees.role_id = roles.id 
        JOIN departments ON roles.department = departments.id
    `);
    return res.rows;
};

const addDepartment = async (name) => {
    const res = await client.query('INSERT INTO departments (name) VALUES ($1) RETURNING *', [name]);
    return res.rows[0];
};

const addRole = async (title, salary, department) => {
    const res = await client.query('INSERT INTO roles (title, salary, department) VALUES ($1, $2, $3) RETURNING *', [title, salary, department]);
    return res.rows[0];
};

const addEmployee = async (first_name, last_name, role_id, manager_id) => {
    const res = await client.query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4) RETURNING *', [first_name, last_name, role_id, manager_id]);
    return res.rows[0];
};

const updateEmployeeRole = async (employee_id, role_id) => {
    const res = await client.query('UPDATE employees SET role_id = $1 WHERE id = $2 RETURNING *', [role_id, employee_id]);
    return res.rows[0];
};

module.exports = {
    getDepartments,
    getRoles,
    getEmployees,
    addDepartment,
    addRole,
    addEmployee,
    updateEmployeeRole
};
