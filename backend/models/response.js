module.exports = (sequelize, DataTypes) => {
    const Response = sequelize.define('Response', {
        questionId: { type: DataTypes.INTEGER, allowNull: false },
        formId: { type: DataTypes.INTEGER, allowNull: false },
        answer: { type: DataTypes.TEXT }
    });
    return Response;
};
