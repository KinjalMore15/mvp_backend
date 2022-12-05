const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        entrance: { type: DataTypes.CHAR(10), allowNull: false },
        gridSize : { type: DataTypes.CHAR(50), allowNull: false },
        walls: { type: DataTypes.JSON, allowNull: false },
        sellerId: { type: DataTypes.INTEGER, allowNull: false }       
    };

    const Maze = sequelize.define('Maze', attributes);
    Maze.belongsTo(db.User, { foreignKey: 'sellerId' });
    return Maze;
}