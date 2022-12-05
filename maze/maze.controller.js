const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const mazeService = require('./maze.service');
const Role = require('_middleware/role');

// routes
router.post('/create', authorize(), createSchema, create);
router.get('/', authorize(), getAll);
// router.get('/:id', authorize(), getById);

module.exports = router;

function createSchema(req, res, next) {
    const schema = Joi.object({
        entrance: Joi.string().required(),
        gridSize: Joi.required(),
        walls: Joi.required()
    });
    validateRequest(req, next, schema);
}

function create(req, res, next) {
 
    mazeService.create(req.body)
        .then(() => res.json({ message: 'Maze Created successful' }))
        .catch(next);
}

function getAll(req, res, next) {
    mazeService.getAll()
        .then(maze => res.json(maze))
        .catch(next);
}

// function getById(req, res, next) {
//     productService.getById(req.params.id)
//         .then(product => res.json(product))
//         .catch(next);
// }

