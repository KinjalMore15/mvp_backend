const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        productName: { type: DataTypes.STRING, allowNull: false },
        cost : { type: DataTypes.INTEGER, allowNull: false },
        amountAvailable: { type: DataTypes.FLOAT(5,2), allowNull: false },
        sellerId: { type: DataTypes.INTEGER, allowNull: false },
    };

    const Product = sequelize.define('Product', attributes);
    Product.belongsTo(db.User, { foreignKey: 'sellerId' });
    return Product;
}