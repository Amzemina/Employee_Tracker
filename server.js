const inquirer = require('inquirer');
const mysql = require('mysql2/promise')
require('dotenv').config();


function getConnection() {
    return mysql.createConnection(
        {
        host: 'localhost',
        port: 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database:  process.env.DB_NAME,
        }
    );
}

function closeConnection(db){
    db.end((err) => {
        if (err) {
            console.error('Error closing connection:', err);
          } else {
            console.log('Connection closed.');
          }
    })
}

function rePrompt(db) {
    closeConnection(db)
    promptUser()
}

const promptUser = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'choices',
            message: 'What would you like to do?',
            choices: ['View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Update employee managers',
                "View employees by manager",
                "View employees by department",
                'Delete a department',
                'Delete a role',
                'Delete an employee',
                'View department budgets']
        }
    ])
        .then((answers) => {
            const { choices } = answers;

            if (choices === "View all departments") {
                viewAllDepartments();
            }

            if (choices === "View all roles") {
                viewAllRoles();
            }

            if (choices === "View all employees") {
                viewAllEmployees();
            }

            if (choices === "Add a department") {
                addDepartment();
            }

            if (choices === "Add a role") {
                addRole();
            }

            if (choices === "Add an employee") {
                addEmployee();
            }

            if (choices === "Update an employee role") {
                updateEmployeeRole();
            }

            if (choices === "Update an employee manager") {
                updateEmployeeManager();
            }

            if (choices === "View employees by department") {
                viewEmployeesByDepartment();
            }

            if (choices === "Delete a department") {
                deleteDepartment();
            }

            if (choices === "Delete a role") {
                deleteRole();
            }

            if (choices === "Delete an employee") {
                deleteEmployee();
            }

            if (choices === "View department budgets") {
                viewBudgets();
            }
        });
};

const departmentQuery = `SELECT * from department`
const roleQuery = `SELECT * FROM role`
const employeeQuery = `SELECT * FROM employee`

viewAllDepartments = async () => {
    const db = await getConnection();
    const departments = await db.query(departmentQuery);
    console.table(departments[0]);
    rePrompt(db)
}
viewAllRoles = async () => {
    const db = await getConnection();
    const rows = await db.query(`
    SELECT r.id, r.title, r.salary, d.name as department
    from role r 
    JOIN department d
    ON r.department_id = d.id
    ORDER BY r.id`);
    console.table(rows[0]);
      rePrompt(db)
}
viewAllEmployees = async () => {
    const db = await getConnection();
    const rows = await db.query(`
    SELECT e.id, e.first_name, e.last_name, r.title, r.salary, d.name as department, CONCAT (m.first_name, ' ', m.last_name) as manager
    from employee e
    LEFT JOIN employee m
    ON e.manager_id = m.id
    JOIN role r 
    ON e.role_id = r.id
    JOIN department d
    ON r.department_id = d.id
    ORDER BY e.id
    `);
    console.table(rows[0]);
      rePrompt(db)
}
addDepartment = async () => {
    const db = await getConnection()
    const input = await inquirer.prompt([
        {
          name: "department",
          message: "Enter New Department Name:",
        },
      ]);
    await db.query('INSERT INTO department (name) values(?)', input.department)
    console.log(`Successfully added department ${input.department}`)
    rePrompt(db)
}
addRole = async () => {
    const db = await getConnection() 
    const departments = await db.query(departmentQuery);
    const input = await inquirer.prompt([
        {
          name: "title",
          message: "Enter new role title:",
        },
        {
          type: "input",
          name: "salary",
          message: "Enter new role salary:",
          validate: input => {
            const numericValue = parseFloat(input);
            return !isNaN(numericValue) && isFinite(numericValue) ? true : 'Please enter a valid numeric value'
          }
        },
        {
            type: "list",
            name: "department",
            message: "Select Department",
            choices: departments[0].map(department => department.name)
        },
      ]);
      await db.query('INSERT INTO role (title, salary, department_id) values(?, ?, ?)', [input.title, input.salary, departments[0].find(department => department.name === input.department).id])
      console.log(`Successfully added role ${input.title} with ${input.salary} in department ${input.department}`)
    rePrompt(db)
}
addEmployee = async () => {
    const db = await getConnection() 
    const roles = await db.query(roleQuery);
    const managers = await db.query(employeeQuery);
    const input = await inquirer.prompt([
    {
        name: "first_name",
        message: "Enter employee's first name:",
      },
      {
        name: "last_name",
        message: "Enter employee's last name:",
      },
      {
        type: "list",
        name: "role",
        message: "Enter employee's role:",
        choices: roles[0].map(role => role.title)
      },
      {
        type: "list",
        name: "manager",
        message: "Enter employee's manager:",
        choices: managers[0].map(employee => `${employee.first_name} ${employee.last_name}`)
      },
    ]);
    await db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) values(?, ?, ?, ?)', [input.first_name, input.last_name, roles[0].find(role => role.title === input.role).id, managers[0].find(employee => `${employee.first_name} ${employee.last_name}` === input.manager).id])
      console.log(`Successfully added new employee ${input.first_name} ${input.last_name} as a ${input.role} working for ${input.manager}`)
    rePrompt(db)
}
updateEmployeeRole = async () => {
    const db = await getConnection() 
    const roles = await db.query(roleQuery);
    const employees = await db.query(employeeQuery);
    const input = await inquirer.prompt([
        {
            type: "list",
            name: "employee",
            message: "Choose employee",
            choices: employees[0].map(employee => `${employee.first_name} ${employee.last_name}`),
          },
          {
            type: "list",
            name: "role",
            message: "Enter employee's role:",
            choices: roles[0].map(role => role.title)
         
          },
        ]);
        await db.query('UPDATE employee set role_id = ? where id = ?', [roles[0].find(role => role.title === input.role).id, employees[0].find(employee => `${employee.first_name} ${employee.last_name}` === input.employee).id] )
        console.log(`Successfully updated employee ${input.employee} as a ${input.role}`)
    rePrompt(db)
}
updateEmployeeManager = () => {
    const db = getConnection() 
    rePrompt(db)
}
viewEmployeesByDepartment = () => {
    const db = getConnection() 
    rePrompt(db)
}
deleteDepartment = () => {
    const db = getConnection() 
    rePrompt(db)
}
deleteRole = () => {
    const db = getConnection() 
    rePrompt(db)
}
deleteEmployee = () => {
    const db = getConnection() 
    rePrompt(db)
}
viewBudgets = () => {
    const db = getConnection() 
    rePrompt(db)
}
promptUser();