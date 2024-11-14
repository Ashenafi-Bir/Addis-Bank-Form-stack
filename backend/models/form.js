module.exports = (sequelize, DataTypes) => {
    const Form = sequelize.define('Form', {
        title: { 
            type: DataTypes.STRING, 
            allowNull: false 
        },
        description: { 
            type: DataTypes.TEXT, 
            allowNull: true 
        }
    }, {
        timestamps: true,
    });
    return Form;
};
