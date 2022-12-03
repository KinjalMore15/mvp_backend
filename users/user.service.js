const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const { Sequelize } = require('sequelize');

module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    deposit,
    reset,
    buy
};

async function authenticate({ user, password }) {
    const user_data = await db.User.scope('withHash').findOne({ where: { user } });

    if (!user_data || !(await bcrypt.compare(password,user_data.dataValues.password)))
        throw 'Username or password is incorrect';
        // authentication successful

    const token = jwt.sign({ sub: user_data.dataValues.id, role: user_data.dataValues.role}, config.secret, { expiresIn: '7d' });

    return { ...omitHash(user_data.get()), token };
}

async function getAll() {
    return await db.User.findAll();
}

async function getById(id) {
    return await getUser(id);
}

async function create(params) {
    // validate
    if (await db.User.findOne({ where: { user: params.user } })) {
        throw 'Username "' + params.username + '" is already taken';
    }
    // hash password
    if (params.password) {
        params.password = await bcrypt.hash(params.password, 10);
    }

    // save user
    await db.User.create(params);
}

async function update(id, params) {
    const user = await getUser(id);

    // validate
    const usernameChanged = params.user && user.user !== params.user;
    if (usernameChanged && await db.User.findOne({ where: { user: params.user } })) {
        throw 'User "' + params.user + '" is already taken';
    }

    // hash password if it was entered
    if (params.password) {
        params.password = await bcrypt.hash(params.password, 10);
    }

    // copy params to user and save
    Object.assign(user, params);
    await user.save();

    return omitHash(user.get());
}

async function _delete(id) {
    const user = await getUser(id);
    await user.destroy();
}

async function deposit(id, params) {
    const user = await getUser(id);    
    // copy params to user and save
    Object.assign(user, params);
    await user.save();
    return user.get();
}
async function reset(id) {
    const user = await db.User.findByPk(id);   
    // copy params to user and save
   await user.update({deposit: 0});
   console.log(">>>>>>----",user.get());
   const reset_user = user.get();
   const reset = {
    'user': reset_user.user,
    'deposit':reset_user.deposit
   }
    return reset;
}

async function buy(id, params) {
      
    // copy params to user and save
    let create_data = {
        productId: params.productId,
        amount: params.amount,
        UserId: id
    };
    await db.ProductBuyer.create(create_data);
    const totalAmount = await db.ProductBuyer.findAll({
        attributes: [
          [Sequelize.fn('sum', Sequelize.col('amount')), 'total_amount'],
        ],
        group: ['UserId'],
      });
     // console.log(totalAmount);
     return totalAmount;
    }

// helper functions

async function getUser(id) {
    const user = await db.User.findByPk(id);
    if (!user) throw 'User not found';
    return user;
}

function omitHash(user) {
    const { hash, ...userWithoutHash } = user;
    return userWithoutHash;
}