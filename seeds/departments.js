
const sequelize = require("../connection");
const Department = require("../Models/department");

const departmentsSeeds = require("./departmentsSeeds.json");

const seedDepartments = async () => {
    

    const departments = await Department.bulkCreate(departmentsSeeds);

    process.exit(0);
};

seedDepartments();