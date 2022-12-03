const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        productId: { type: DataTypes.INTEGER, allowNull: false },
        amount : { type: DataTypes.FLOAT(5,2), allowNull: false },
        UserId: { type: DataTypes.INTEGER, allowNull: false },
    };

    const ProductBuyer = sequelize.define('ProductBuyer', attributes);
    ProductBuyer.belongsTo(db.Product, { foreignKey: 'productId' });
    ProductBuyer.belongsTo(db.User, { foreignKey: 'UserId' });
    return ProductBuyer;
}