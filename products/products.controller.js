const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const productService = require('./product.service');
const Role = require('_middleware/role');

// routes
router.post('/create', authorize(Role.Seller), createSchema, create);
router.get('/', authorize(Role.Seller), getAll);
router.get('/:id', authorize(Role.Seller), getById);
router.put('/:id', authorize(Role.Seller), updateSchema, update);
router.delete('/:id', authorize(Role.Seller), _delete);

module.exports = router;

function createSchema(req, res, next) {
    console.log(req.body);
    const schema = Joi.object({
        productName: Joi.string().required(),
        cost: Joi.number().integer().valid(5,10,20,50,100).required(),
        amountAvailable: Joi.number().required()
    });
    validateRequest(req, next, schema);
}

function create(req, res, next) {
    console.log(req.user.id);
    let product= {
        productName:req.body.productName,
        cost: req.body.cost,
        amountAvailable: req.body.amountAvailable,
        sellerId: req.user.id
    }
    productService.create(product)
        .then(() => res.json({ message: 'Product Created successful' }))
        .catch(next);
}

function getAll(req, res, next) {
    productService.getAll()
        .then(products => res.json(products))
        .catch(next);
}

function getById(req, res, next) {
    productService.getById(req.params.id)
        .then(product => res.json(product))
        .catch(next);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        productName: Joi.string().empty(''),
        cost: Joi.number().integer().empty(''),
        amountAvailable: Joi.number().empty('')
    });
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    productService.update(req.params.id, req.body)
        .then(product => res.json(product))
        .catch(next);
}

function _delete(req, res, next) {
    productService.delete(req.params.id)
        .then(() => res.json({ message: 'Product deleted successfully' }))
        .catch(next);
}