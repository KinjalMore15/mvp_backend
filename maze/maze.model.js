const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        entrance: { type: DataTypes.CHAR(10), allowNull: false },
        gridSize : { type: DataTypes.CHAR(50), allowNull: false },
        walls: { type: DataTypes.JSON, allowNull: false }       
    };

    const Maze = sequelize.define('Maze', attributes);
    
    return Maze;
}