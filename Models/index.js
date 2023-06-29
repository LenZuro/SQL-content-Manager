const Department = require("./department");
const Employee = require("./employee");
const Role = require("./role");

Employee.belongsTo(Role, {
    foreignKey: "role_id"
});
Role.belongsTo(Department , {
    foreignKey: "department_id"
});

module.exports = {Department ,Employee ,Role };