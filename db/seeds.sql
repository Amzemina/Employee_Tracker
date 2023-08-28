INSERT INTO department (name)
VALUES 
('IT'),
('Accounting'),
('Marketing'),
('Operations');

INSERT INTO role (title, salary, department_id)
VALUES
('Full Stack Developer', 100000, 1),
('Software Engineer', 120000, 1),
('Accountant', 130000, 2), 
('Finanical Analyst', 150000, 2),
('Marketing Coordindator', 80000, 3), 
('Sales Lead', 90000, 3),
('Project Manager', 95000, 4),
('Operations Manager', 90000, 4);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('kirby', 'Puffball', 2, null),
('David', 'Zaymina', 1, 1),
('Anya', 'Coop', 3, 3),
('James', 'Bond', 4, null),
('Brynnie', 'Winnie', 5, 5),
('Optimus', 'Prime', 6, null),
('Bananas', 'Pajamas', 7, null),
('Ashley', 'Smashley', 8, 7);