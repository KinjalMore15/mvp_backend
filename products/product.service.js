const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');

module.exports = {
    create,
    getAll,
    getById,
    update,
    delete: _delete
};



async function getAll() { 
    return await db.Product.findAll();
}

async function getById(id) {
    return await getProduct(id);
}

async function create(params) {
    // validate
    if (await db.Product.findOne({ where: { productName: params.productName } })) {
        throw 'Productname "' + params.productName + '" is already taken';
    }
   
    // save product

    await db.Product.create(params);
}

async function update(id, params) {
    const product = await getProduct(id);

    // validate
    const productNameChanged = params.product && product.productName !== params.productName;
    if (productNameChanged && await db.Product.findOne({ where: { productName : params.productName } })) {
        throw 'Product "' + params.productName + '" is already taken';
    }

    // copy params to product and save
    Object.assign(product, params);
    await product.save();

    return product.get();
}

async function _delete(id) {
    const product = await getProduct(id);
    await product.destroy();
}

// // helper functions

async function getProduct(id) {
    const product = await db.Product.findByPk(id);
    if (!product) throw 'Product not found';
    return product;
}

