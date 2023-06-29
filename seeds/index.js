const sequelize = require("../connection");
const departments = require("./departments");
const employees = require("./employees");
const roles = require("./roles");

const seedData = async() => {
    await sequelize.sync({force:true})
    await departments();
    await employees();
    await roles();
    process.exit(0);
}
seedData();