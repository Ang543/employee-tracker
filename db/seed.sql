USE employeeTracker;

INSERT INTO department (name) VALUES ("Human Resources");

INSERT INTO role (title, salary, department_id) VALUES ("Junior Engineer", 70000, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Peter", "Frank", 2, NULL);