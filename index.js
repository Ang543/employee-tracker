var inquirer = require("inquirer");
var mysql2 = require("mysql2");
require("console.table");
require("dotenv").config()

const connection = mysql2.createConnection({
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect(function (err) {
    if (err) console.log(err);
});


// asking the questions
function mainMenu() {
    inquirer.prompt([
        {
            type: "list",
            name: "userChoice",
            message: "What would you like to do?",
            choices: [
                "View all departments",
                "View all roles",
                "View all employees",
                "Add a department",
                "Add a role",
                "Add an employee",
                "Update an employee role",
                "Exit"
            ]
        }
    ])
        .then(function (answer) {
            if (answer.userChoice == "View all departments") {
                viewAllDepartments();
            } else if (answer.userChoice == "View all employees") {
                viewAllEmployees();
            } else if (answer.userChoice == "Add a department") {
                addDepartment();
            } else if (answer.userChoice == "Update an employee role") {
                updateEmployeeRole();
            } else if (answer.userChoice == "Add an employee") {
                addEmployee();
                
            } else {
                process.exit(1)
            }
        })
}

// create functions for each functionality:
function viewAllDepartments() {
    connection.promise().query("SELECT * FROM department;")
        .then(function ([data]) {
            console.log("Showing all departments")
            console.table(data);
            mainMenu()
        })
}

function viewAllEmployees() {
    connection.promise().query("SELECT * FROM employee;")
        .then(function ([data]) {
            console.log("Showing all employees")
            console.table(data);
            mainMenu()
        })
}

function addDepartment() {
    inquirer.prompt([
        {
            type: "input",
            name: "departmentName",
            message: "What is the name of the new department?"
        }
    ]).then(function (answer) {
        connection.promise().query(`INSERT INTO department(name) VALUES ("${answer.departmentName}");`)
            .then(function ([data]) {
                console.log("Added department")
                mainMenu()
            })
    })
}

function addEmployee() {
    inquirer.prompt([
        {
            type: "input",
            name: "employeeName",
            message: "What is the employees first name?"
        }
    ]).then(function (answer) {
        connection.promise().query(`INSERT INTO employee(first_name) VALUES ("${answer.employeeName}");`)
            .then(function ([data]) {
                console.log("Added First Name")

                // mainMenu()
            }).then(function () {
                return inquirer.prompt([
                    {
                        type: "input",
                        name: "employeeName",
                        message: "What is the employees last name?"
                    }
                ])
            }).then(function (answer) {
                connection.promise().query(`INSERT INTO employee(last_name) VALUES ("${answer.employeeName}");`)
                    .then(function ([data]) {
                        console.log("Added Last Name")
                    })

            }).then(function () {
                return inquirer.prompt([
                    {
                        type: "input",
                        name: "employeeName",
                        message: "What is the employees role?"
                    }
                ])
            }).then(function (answer) {
               return connection.promise().query(`INSERT INTO employee(role_id) VALUES ("${answer.employeeName}");`)
                    // .then(function ([data]) {
                    //     console.log("Added Role")
                    // })

            }).then(function () {
                return inquirer.prompt([
                    {
                        type: "input",
                        name: "employeeName",
                        message: "Is the employee a manager?"
                    }
                ])
            }).then(function (answer) {
                connection.promise().query(`INSERT INTO employee(manager_id) VALUES ("${answer.employeeName}");`)
                    .then(function ([data]) {
                        console.log("Confirmed Managerial Status")
                    })
                mainMenu()
            })

    })
}

function updateEmployeeRole() {
    connection.promise().query(`SELECT * FROM employee;`)
        .then(function ([employees]) {

            var employeeChoices = employees.map(function (employee) {
                return {
                    name: employee.first_name + " " + employee.last_name,
                    value: employee.id
                }
            })

            inquirer.prompt([
                {
                    type: "list",
                    name: "targetEmployee",
                    message: "Which employee do you want to update?",
                    choices: employeeChoices
                }
            ])
                .then(function (answer1) {

                    connection.promise().query(`SELECT * FROM role;`)
                        .then(function ([roles]) {
                            var roleChoices = roles.map(function (role) {
                                return {
                                    name: role.title,
                                    value: role.id
                                }
                            })

                            inquirer.prompt(
                                {
                                    type: "list",
                                    name: "targetRole",
                                    message: "To which role do you want to change this employee to?",
                                    choices: roleChoices
                                }
                            ).then(function (answer2) {
                                console.log(answer1.targetEmployee)
                                console.log(answer2.targetRole)

                                connection.promise().query("UPDATE employee SET role_id = ? WHERE id = ?", [answer2.targetRole, answer1.targetEmployee])
                                    .then(function () {
                                        console.log("Employee updated!");
                                        mainMenu();
                                    })

                            })
                        })
                })

        })
}
// 7 functions
// 3 views
// 3 create
// 1 update
// viewAllDepartments()
// addDepartment()

// viewAllRoles
// addRole
// addEmployee

mainMenu()