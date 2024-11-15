module.exports = (sequelize, DataTypes) => {
    const Question = sequelize.define('Question', {
        questionText: { type: DataTypes.STRING, allowNull: false },
        type: { type: DataTypes.ENUM('short', 'radio', 'checkbox'), allowNull: false },
        options: { type: DataTypes.TEXT }, // JSON string for multiple choice options
        subDescription: { type: DataTypes.STRING } // Added subDescription field
    }, {
        timestamps: true, 
    });
    return Question;
};
