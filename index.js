const { Department, Role , Employee } = require("./Models");

const sequelize = require("./connection");

const inquirer = require("inquirer");
const { async } = require("rxjs");
    sequelize.sync({force:false}).then(() =>{
        console.log("sucsess");
        init();
    })
// Department.sync({ force: true }).then(() =>
//   Role.sync().then(() =>
//     Employee.sync().then(() => {
//       console.log("created tables");
//      init();
//     })
//   )
// );

function init() {
    console.log("its working");
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
    
};
const viewAllDepartments = () => {
    Department.findAll({raw:true}).then((data) => {
        console.log("this is getitng cloer to working" , data);
        console.table(data);
        init();
    });
};

const viewAllRoles = () => {
      Role.findAll({
        raw:true,
        include: [{model:Department}],
    }).then((data) => {
        console.table(
            data.map((role) => {
                return {
                    id: role.id,
                    salary: role.salary,
                    title: role.title,
                    department: role["Department.name"],
                };
            })
        );
        init();
    });
};


const viewAllEmployees = () => {
     Employee.findAll({
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
        init();
    });
};

const addDepartment = () => {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the name of the new department?",
            name: "addDepartment",
        },
    ])
    .then((answer) => {
        Department.create({ name: answer.addDepartment}).then((data) => {
            init();
        });
    });
};

const addRole = async () => {
    const departments = await Department.findAll({
        attributes: [
            ["id", "value"],
            ["name", "name"],
        ],
    });
    const departmentChoices = departments.map((department) => {
        return {
            name: department.name,
            value: department.id
        }
    }
        //department.get({ plain:true })
    );

    //[{name: Legal, value: 1}, {name: Finance, value: 2}]
    inquirer.prompt([
        {
            type: "input",
            message: "What is the name of the role?",
            name: "title",
        },
        {
            type: "input",
            message: "What is the salary for the role?",
            name: "salary",
        },
        {
            type: "list",
            message: "What department is this role in?",
            name: "department_id",
            choices: departmentChoices,
        },
    ])
    .then((answer) => {
        Role.create(answer).then((data) => {
            init();
        });
    });
};

const addEmmployee = async () => {
    let roles = await Role.findAll({
        attributes: [
            ["id" , "value"],
            ["title" , "name"],
        ],
    });
    roles = roles.map((role) => role.get({ plain:true}));

    let managers = await Employee.findAll({
        attributes:[
            ["id" , "value"],
            ["first_name" , "name"],
            ["last_name" , "lastName"],
        ],
    });
    managers = managers.map((manager) => {
        manager.get({ plain:true });
        const managerInfo = manager.get();
        return{
            name: `${managerInfo.name} ${managerInfo.lastName}`,
            value: managerInfo.value,
        };
    });
    managers.push({ type: "Null Manager" , value: null });

    inquirer.prompt([
        {
            type: "input",
            message: "What is the new employees first name?",
            name: "first_name",
        },
        {
            type: "input",
            message: "What is the new employees last name?",
            name: "last_name",
        },
        {
            type: "list",
            message: "What is the new employees role?",
            name: "role_id",
            choices: roles,
        },
        {
            type: "list",
            message: "What manager would you like them to be under?",
            name: "manager_id",
            choices: managers,
        },
    ])

    .then((answer) => {
        Employee.create(answer).then((data) => {
            init();
        });
    });
};

const updateEmployeeRole = async () => {
    let employees = await Employee.findAll({
        attributes: [
            ["id" , "value"],
            ["first_name" , "name"],
            ["last_name" , "lastName"],
        ],
    });
    employees = employees.map((employee) => {
        employee.get({ plain:true });
        const employeeInfo = employee.get();
        return{
            name: `${employeeInfo.name} ${employeeInfo.lastName}`,
            value: employeeInfo.value,
        };
    });

    let roles = await Role.findAll({
        attributes:[
            ["id" , "value"],
            ["title" , "name"],
        ],
    });

    roles = roles.map((role) => role.get({ plain:true}));

    inquirer.prompt([
        {
            type: "list",
            message: "What employee's role is getting updated?",
            name: "id",
            choices: employees,
        },
        {
            type: "list",
            message: "What is the name of the updated role they will be getting?",
            name: "role_id",
            choices: roles,
        },
    ])

    .then((answer) => {
        Employee.update(answer , {
            where: {
                id: answer.id,
            },
        }).then((data) => {
            init();
        });
    });
};