const inquirer = require('inquirer');
const mysql = require('mysql2')
require('dotenv').config();



    // const db = mysql.createConnection(
    //     {
    //       host: 'localhost',
    //       port: 3306,
    //       user: process.env.DB_USER,
    //       password: process.env.DB_PASSWORD,
    //       database:  process.env.DB_NAME,
    //     },
    // );

function getConnection() {
    return mysql.createConnection(
        {
          host: 'localhost',
          port: 3306,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database:  process.env.DB_NAME,
        },
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
                'View department budgets',
                'No Action']
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

viewAllDepartments = () => {
    const db = getConnection() 
    db.query(`SELECT * from department`, (err, result) => {
        if (err) {
          console.log(err);
        }
        console.table(result);
      });
      rePrompt(db)
}
viewAllRoles = () => {
    const db = getConnection()
    db.query(`
    SELECT r.id, r.title, r.salary, d.name as department
    from role r 
    JOIN department d
    ON r.department_id = d.id
    ORDER BY r.id`, (err, result) => {
        if (err) {
          console.log(err);
        }
        console.table(result);
      });
      rePrompt(db)
}
viewAllEmployees = () => {
    const db = getConnection() 
    db.query(`
    SELECT e.id, e.first_name, e.last_name, r.title, r.salary, d.name as department, CONCAT (m.first_name, ' ', m.last_name) as manager
    from employee e
    LEFT JOIN employee m
    ON e.manager_id = m.id
    JOIN role r 
    ON e.role_id = r.id
    JOIN department d
    ON r.department_id = d.id
    ORDER BY e.id
    `, (err, result) => {
        if (err) {
          console.log(err);
        }
        console.table(result);
      });
      rePrompt(db)
}
addDepartment = () => {
    const db = getConnection()

    rePrompt(db)
}
addRole = () => {
    const db = getConnection() 
    rePrompt(db)
}
addEmployee = () => {
    const db = getConnection() 
    rePrompt(db)
}
updateEmployeeRole = () => {
    const db = getConnection() 
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