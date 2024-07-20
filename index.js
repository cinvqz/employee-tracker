const inquirer = require('inquirer');
const { 
    getDepartments, 
    getRoles, 
    getEmployees, 
    addDepartment, 
    addRole, 
    addEmployee, 
    updateEmployeeRole 
} = require('./db/queries');

const mainMenu = async () => {
    const answers = await inquirer.prompt({
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role',
            'Exit'
        ]
    });

    switch (answers.action) {
        case 'View all departments':
            const departments = await getDepartments();
            console.table(departments);
            break;
        case 'View all roles':
            const roles = await getRoles();
            console.table(roles);
            break;
        case 'View all employees':
            const employees = await getEmployees();
            console.table(employees);
            break;
        case 'Add a department':
            const departmentName = await inquirer.prompt({
                type: 'input',
                name: 'name',
                message: 'Enter the name of the department:'
            });
            await addDepartment(departmentName.name);
            console.log('Department added.');
            break;
        case 'Add a role':
            const roleDetails = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'title',
                    message: 'Enter the title of the role:'
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: 'Enter the salary of the role:'
                },
                {
                    type: 'input',
                    name: 'department',
                    message: 'Enter the department ID for the role:'
                }
            ]);
            await addRole(roleDetails.title, roleDetails.salary, roleDetails.department);
            console.log('Role added.');
            break;
        case 'Add an employee':
            const rolesList = await getRoles();
            const employeesList = await getEmployees();

            const roleChoices = rolesList.map(role => ({
                name: `${role.title} (ID: ${role.id})`,
                value: role.id
            }));

            const employeeDetails = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'first_name',
                    message: 'Enter the first name of the employee:'
                },
                {
                    type: 'input',
                    name: 'last_name',
                    message: 'Enter the last name of the employee:'
                },
                {
                    type: 'list',
                    name: 'role_id',
                    message: 'Select the role for the employee:',
                    choices: roleChoices
                },
                {
                    type: 'input',
                    name: 'manager_id',
                    message: 'Enter the manager ID for the employee (if any):',
                    validate: (input) => {
                        if (input === '') return true;
                        const validManager = employeesList.find(employee => employee.id == input);
                        return validManager ? true : 'Invalid manager ID. Please enter a valid manager ID or leave blank.';
                    }
                }
            ]);

            await addEmployee(employeeDetails.first_name, employeeDetails.last_name, employeeDetails.role_id, employeeDetails.manager_id || null);
            console.log('Employee added.');
            break;
        case 'Update an employee role':
            const updateDetails = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'employee_id',
                    message: 'Enter the ID of the employee you want to update:'
                },
                {
                    type: 'input',
                    name: 'role_id',
                    message: 'Enter the new role ID for the employee:'
                }
            ]);
            await updateEmployeeRole(updateDetails.employee_id, updateDetails.role_id);
            console.log('Employee role updated.');
            break;
        case 'Exit':
            console.log('Goodbye!');
            process.exit();
    }
    mainMenu();
};

mainMenu();
