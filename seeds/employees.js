const sequelize = require("../connection");
const Employee = require("../Models/employee");

const employeeSeed = require("./employeeSeeds.json");

const seedEmployees = async () => {
    

    const employees = await Employee.bulkCreate(employeeSeed);

    process.exit(0);
};

seedEmployees();