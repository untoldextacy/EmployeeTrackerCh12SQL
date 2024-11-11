# Employee Tracker
## Description
The Employee Tracker application allows an organization to manage and track employee data efficiently. It uses a PostgreSQL database to store data related to employees, departments, and roles. The application provides an interactive command-line interface to perform CRUD operations such as adding, viewing, updating, and deleting employee information, departments, and roles.

## Features
- View all employees, departments, and roles
- Add new employees, departments, and roles
- Update employee information
- Delete employees, departments, and roles
- View employees by department or manager
- View total utilized budget of a department (combined salaries of employees in the department)
  
## Walkthrough Video
You can view the walkthrough video demonstrating the functionality of the Employee Tracker application [here](https://www.youtube.com/watch?v=NwLW8msP55E)

## Installation
To use the Employee Tracker application, follow these steps:

1) Clone the repository:

```bash
git clone https://github.com/untoldextacy/EmployeeTrackerCh12SQL.git
```
2) Install dependencies: Navigate to the project directory and install the required npm packages.

```bash
cd Employee-Tracker
npm install
```

- Inquirer: Used to prompt the user with a series of questions.
- pg: PostgreSQL client for Node.js to interact with the database.
3) Set up your PostgreSQL database: Ensure you have PostgreSQL installed on your machine and a database created to store the data. You can follow the schema provided in the instructions to create the necessary tables.

Example SQL schema:

``` sql
Copy code
CREATE TABLE departments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  salary DECIMAL(10, 2) NOT NULL,
  department_id INTEGER REFERENCES departments(id)
);

CREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  role_id INTEGER REFERENCES roles(id),
  manager_id INTEGER REFERENCES employees(id)
);
```
4) Run the application: After setting up your database and installing the necessary dependencies, run the application with the following command:

```bash
node index.js
```

The application will prompt you with a menu of options, where you can add, view, update, or delete employees, departments, and roles.

# Usage
Once the application is running, the following options will be available:
```
- View all employees: Displays a list of all employees along with their roles and departments.
- View all departments: Displays a list of all departments.
- View all roles: Displays a list of all roles in the company.
- Add employee: Allows you to add a new employee, specifying their first name, last name, role, and manager (if applicable).
- Add department: Allows you to add a new department to the company.
- Add role: Allows you to add a new role to a department, specifying the title and salary.
- Update employee role: Lets you update an employee's role.
- Delete employee: Removes an employee from the system.
- Delete department: Deletes a department, removing all roles and employees associated with it.
- Delete role: Deletes a role from the system.
- View employees by department: Displays employees by their department.
- View employees by manager: Displays employees managed by a specific employee.
- View department budget: Displays the total salary budget of a department.
```

Technologies Used

- Node.js: JavaScript runtime to build the application.
- PostgreSQL: Relational database to store employee, department, and role data.
- Inquirer: Package for collecting input from users via command line prompts.
- pg: PostgreSQL client for Node.js to interact with the database.
