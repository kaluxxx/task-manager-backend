const authenticationService = require("../services/authenticationService");
const userService = require("../services/userService");

const authenticationController = {
    async login(req, res, next) {
        try {
            const {username, password} = req.body;
            const user = await userService.getUser(username);
            const token = await authenticationService.login(user, password);
            res.json({token});
        } catch (e) {
            next(e);
        }
    },
    async register(req, res, next) {
        try {
            const {username, password} = req.body;
            await authenticationService.register(username, password);
            res.status(201).json({message: 'User registered successfully'});
        } catch (e) {
            next(e);
        }
    }
}

module.exports = authenticationController;