const sequelize = require("../connection");
const Role = require("../Models/role");

const rolesSeeds = require("./rolesSeeds.json");

const seedRoles = async () => {
    

    const roles = await Role.bulkCreate(rolesSeeds);

    process.exit(0);
};

seedRoles();