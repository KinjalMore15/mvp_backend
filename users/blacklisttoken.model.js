const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        token: { type: DataTypes.STRING, allowNull: false },
    };



    return sequelize.define('BlackListToken', attributes);
}