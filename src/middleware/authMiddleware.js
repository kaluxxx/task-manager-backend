const jwt = require('jsonwebtoken');
const userService = require("../services/userService");

function authenticateToken(req, res, next) {
    const {ACCESS_TOKEN_SECRET} = process.env;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, ACCESS_TOKEN_SECRET, async (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = await userService.getUser(user.username);
        next();
    });
}

module.exports = authenticateToken;