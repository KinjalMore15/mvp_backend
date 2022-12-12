const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const userService = require('./user.service');
const Role = require('_middleware/role');

// routes
router.post('/login', authenticateSchema, authenticate);
router.post('/logout', authorize(), logout);
router.post('/register', registerSchema, register);
router.get('/', authorize(), getAll);
router.get('/current', authorize(), getCurrent);
router.get('/:id', authorize(), getById);
router.put('/:id', authorize(), updateSchema, update);
router.delete('/:id', authorize(), _delete);
router.post('/deposit', authorize(Role.Buyer),  depositSchema, deposit);
router.post('/reset', authorize(Role.Buyer), reset);
router.post('/buy', authorize(Role.Buyer), buySchema, buy);

module.exports = router;

function authenticateSchema(req, res, next) {
    const schema = Joi.object({
        user: Joi.string().required(),
        password: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => res.json(user))
        .catch(next);
}
function logout(req, res, next) {
    var sess = req.user;
    console.log(sess);
    if(sess){
        req.user = null;
        return  res.json(null, {'success': true, "message": "user logout successfully"});
    }
    // callback(null, {'success': true, "message": "user logout successfully"});
}

function registerSchema(req, res, next) {
    console.log(req.body);
    const schema = Joi.object({
        user: Joi.string().required(),
        password: Joi.string().required(),
        role: Joi.string().required(),
        deposit: Joi.number().required()
    });
    validateRequest(req, next, schema);
}

function register(req, res, next) {
    userService.create(req.body)
        .then(() => res.json({ message: 'Registration successful' }))
        .catch(next);
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(next);
}

function getCurrent(req, res, next) {
    res.json(req.user);
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => res.json(user))
        .catch(next);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        firstName: Joi.string().empty(''),
        lastName: Joi.string().empty(''),
        username: Joi.string().empty(''),
        password: Joi.string().min(6).empty('')
    });
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(user => res.json(user))
        .catch(next);
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({ message: 'User deleted successfully' }))
        .catch(next);
}

function depositSchema(req, res, next) {
    const schema = Joi.object({
        deposit: Joi.number().integer().valid(5,10,20,50,100).required()
    });
    validateRequest(req, next, schema);
}

function deposit(req, res, next) {
    let id = req.user.id;
    userService.deposit(id, req.body)
        .then(user => res.json(user))
        .catch(next);
}

function reset(req, res, next) {
    let id = req.user.id;
    userService.reset(id)
        .then(user => res.json(user))
        .catch(next);
}

function buySchema(req, res, next) {
    const schema = Joi.object({
        productId: Joi.number().integer().required(),
        amount: Joi.number().integer().required()
    });
    validateRequest(req, next, schema);
}

function buy(req, res, next) {
    let userId = req.user.id;
    userService.buy(userId, req.body)
        .then(user => res.json(user))
        .catch(next);
}