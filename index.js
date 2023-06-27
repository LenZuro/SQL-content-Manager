const { Department, Role , Employee } = require("./Models");

const sequelize = require("./connection");

const inquirer = require("inquirer");

sequelize.sync({force:false}).then(() => {
    options();
});

function options() {
    inquirer
    .prompt([
        {
            type: "list",
            message: "What would you like to manage today?",
            choices: [
                "View All Departments",
                "View All Roles",
                "View All Employees",
                "Add Department",
                "Add Role",
                "Add Employee",
                "Update Employee Role",
            ],
            name: "companyManager"
        },
    ])
    .then((answers) => {
        if (answers.companyManager === "View All Departments") {
            viewAllDepartments();
        } else if (answers.companyManager === "View All Roles") {
            viewAllRoles();
        } else if (answers.companyManager === "View All Employees"){
            viewAllEmployees();
        } else if (answers.companyManager === "Add Department"){
            addDepartment();
        } else if (answers.companyManager === "Add Role"){
            addRole();
        } else if (answers.companyManager === "Add Employee"){
            addEmmployee();
        } else {
            updateEmployeeRole();
        }
    });
}


const viewAllDepartments = () => {
    var departments = Department.findAll({raw:true}).then((data) => {
        console.table(data);
        options();
    });
};

const viewAllRoles = () => {
    var roles = Role.findall({
        raw:true,
        include: [{model:Department}],
    }).then((data) => {
        console.table(
            data.map((role) => {
                return {
                    id: role.id,
                    title: role.salary,
                    department: role["Department.name"],
                };
            })
        );
        options();
    });
};


const viewAllEmployees = () => {
    var employees = Employee.findAll({
        raw:true,
        include: [{ model:Role , include:[{ model:Department}] }],
    }).then((data) => {
        const employeeSearch = {};

        for (var i = 0; i < data.length; i++){
            const employee = data[i];
            employeeSearch[employee.id] = 
            employee.first_name + " " + employee.last_name;
        }
        console.table(
            data.map((employee) => {
                return {
                    id: employee.id,
                    first_name: employee.first_name,
                    last_name: employee.last_name,
                    title: employee["Role.title"],
                    department: employee ["Role.Department.name"],
                    salary: employee ["Role.salary"],
                    manager: employeeSearch [employee.manager_id],
                };
            })
        );
        options();
    });
};