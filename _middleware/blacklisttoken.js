const jwt = require('express-jwt');
const { secret } = require('config.json');
const db = require('_helpers/db');

module.exports = BlackListToken;

function BlackListToken() {
    return [
        async (req, res, next) => {
            const token = req.header('Authorization').replace('Bearer ', '');
            console.log("token",token);
            // get user with id from token 'sub' (subject) property
            const is_black = await db.BlackListToken.findOne({ where: { token: token } });
            console.log(">>>is_black",is_black);
            console.log(">>>is_black",!is_black);
          
            // // check user still exists
            if (is_black) {
                // user's role is not authorized
                return res.status(401).json({ message: 'Unauthorized' });
            }

            // if (!user)
            //     return res.status(401).json({ message: 'Unauthorized' });

            // // authorization successful
            // req.user = user.get();
            next();
        }
    ];
}