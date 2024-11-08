const inquirer = require('inquirer');
const db = require('./db/db');

db.query('SELECT * FROM department', [])
    .then(res => console.log(res.rows))
    .catch(err => console.error(err));


// Main function to start the application
const startApp = () => {
    inquirer.prompt({
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
        ],
    }).then(handleUserAction);
};

// Handle user action
const handleUserAction = (response) => {
    switch (response.action) {
        case 'View all departments':
            viewData('department');
            break;
        case 'View all roles':
            viewRoles();
            break;
        case 'View all employees':
            viewEmployees();
            break;
        case 'Add a department':
            addDepartment();
            break;
        case 'Add a role':
            addRole();
            break;
        case 'Add an employee':
            addEmployee();
            break;
        case 'Update an employee role':
            updateEmployeeRole();
            break;
        case 'Exit':
            db.end();
            break;
    }
};

// Generic function to view data from a specified table
const viewData = (table) => {
    db.query(`SELECT * FROM ${table}`, (err, res) => {
        if (err) throw err;
        console.table(res.rows);
        startApp();
    });
};

// View roles with joined department data
const viewRoles = () => {
    const query = `
        SELECT role.id, role.title, role.salary, department.name AS department
        FROM role
        JOIN department ON role.department_id = department.id;
    `;
    db.query(query, (err, res) => {
        if (err) throw err;
        console.table(res.rows);
        startApp();
    });
};

// View employees with joined role and manager data
const viewEmployees = () => {
    const query = `
        SELECT employee.id, employee.first_name, employee.last_name, role.title, 
               department.name AS department, role.salary, 
               CONCAT(manager.first_name, ' ', manager.last_name) AS manager
        FROM employee
        LEFT JOIN role ON employee.role_id = role.id
        LEFT JOIN department ON role.department_id = department.id
        LEFT JOIN employee AS manager ON employee.manager_id = manager.id;
    `;
    db.query(query, (err, res) => {
        if (err) throw err;
        console.table(res.rows);
        startApp();
    });
};

// Function to add a department
const addDepartment = () => {
    inquirer.prompt({
        type: 'input',
        name: 'name',
        message: 'Enter the name of the department:',
        validate: input => input ? true : 'Department name cannot be empty.',
    }).then((response) => {
        db.query('INSERT INTO department (name) VALUES ($1)', [response.name], (err) => {
            if (err) throw err;
            console.log(`Department ${response.name} added.`);
            startApp();
        });
    });
};

// Function to add a role
const addRole = () => {
    db.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;

        const departments = res.rows.map(dept => ({
            name: dept.name,
            value: dept.id
        }));

        inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'Enter the title of the role:',
                validate: input => input ? true : 'Role title cannot be empty.',
            },
            {
                type: 'input',
                name: 'salary',
                message: 'Enter the salary for the role:',
                validate: input => !isNaN(input) ? true : 'Salary must be a number.',
            },
            {
                type: 'list',
                name: 'department_id',
                message: 'Select the department for this role:',
                choices: departments,
            },
        ]).then((response) => {
            db.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', 
                [response.title, response.salary, response.department_id], (err) => {
                if (err) throw err;
                console.log(`Role ${response.title} added.`);
                startApp();
            });
        });
    });
};

// Function to add an employee
const addEmployee = () => {
    Promise.all([
        db.query('SELECT * FROM role'),
        db.query('SELECT * FROM employee')
    ]).then(([rolesRes, employeesRes]) => {
        const roles = rolesRes.rows.map(role => ({
            name: role.title,
            value: role.id
        }));

        const managers = employeesRes.rows.map(emp => ({
            name: `${emp.first_name} ${emp.last_name}`,
            value: emp.id
        })).concat({ name: 'None', value: null });

        inquirer.prompt([
            {
                type: 'input',
                name: 'first_name',
                message: 'Enter the employee’s first name:',
                validate: input => input ? true : 'First name cannot be empty.',
            },
            {
                type: 'input',
                name: 'last_name',
                message: 'Enter the employee’s last name:',
                validate: input => input ? true : 'Last name cannot be empty.',
            },
            {
                type: 'list',
                name: 'role_id',
                message: 'Select the role for this employee:',
                choices: roles,
            },
            {
                type: 'list',
                name: 'manager_id',
                message: 'Select the manager for this employee:',
                choices: managers,
            },
        ]).then((response) => {
            db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', 
                [response.first_name, response.last_name, response.role_id, response.manager_id], (err) => {
                if (err) throw err;
                console.log(`Employee ${response.first_name} ${response.last_name} added.`);
                startApp();
            });
        });
    });
};

// Function to update an employee's role
const updateEmployeeRole = () => {
    Promise.all([
        db.query('SELECT * FROM employee'),
        db.query('SELECT * FROM role')
    ]).then(([employeesRes, rolesRes]) => {
        const employees = employeesRes.rows.map(emp => ({
            name: `${emp.first_name} ${emp.last_name}`,
            value: emp.id
        }));

        const roles = rolesRes.rows.map(role => ({
            name: role.title,
            value: role.id
        }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'employee_id',
                message: 'Select the employee to update:',
                choices: employees,
            },
            {
                type: 'list',
                name: 'role_id',
                message: 'Select the new role for this employee:',
                choices: roles,
            },
        ]).then((response) => {
            db.query('UPDATE employee SET role_id = $1 WHERE id = $2', 
                [response.role_id, response.employee_id], (err) => {
                if (err) throw err;
                console.log(`Employee role updated.`);
                startApp();
            });
        });
    });
};

// Start the application
startApp();
