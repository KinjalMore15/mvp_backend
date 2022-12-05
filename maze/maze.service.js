const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');

module.exports = {
    create,
    getAll,
    getById
};



async function getAll(userid) { 
    return await db.Maze.findAll({ where: { sellerId: userid } });
}

async function getById(id) {
    return await getMaze(id);
}

async function create(params) {
    // save product

    await db.Maze.create(params);
}



// // helper functions

async function getMaze(id) {
    const maze = await db.Maze.findByPk(id);
    if (!maze) throw 'Maze not found';
    return maze;
}

