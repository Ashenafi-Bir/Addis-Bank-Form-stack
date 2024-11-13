const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('addis_form', 'root', 'Ahuu@2112', {
    host: 'localhost',
    dialect: 'mysql'
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Form = require('./form')(sequelize, Sequelize);
db.Question = require('./question')(sequelize, Sequelize);
db.Response = require('./response')(sequelize, Sequelize);

// Associations
db.Form.hasMany(db.Question, { as: "questions", foreignKey: "formId" });
db.Question.belongsTo(db.Form, { foreignKey: "formId", onDelete: "SET NULL", onUpdate: "CASCADE" });

db.Question.hasMany(db.Response, { as: "responses", foreignKey: "questionId" });
db.Response.belongsTo(db.Question, { foreignKey: "questionId", onDelete: "CASCADE", onUpdate: "CASCADE" });

module.exports = db;
