module.exports = (sequelize, DataTypes) => {
    const Form = sequelize.define('Form', {
        title: { 
            type: DataTypes.STRING, 
            allowNull: false 
        },
        description: { // Add the description field
            type: DataTypes.TEXT, 
            allowNull: true // description can be optional
        }
    });
    return Form;
};
