require('dotenv').config();
const bcrypt = require("bcrypt");

const {sign} = require("jsonwebtoken");
const userService = require("./userService");
const authenticationService = {
    async login(user, password) {
        const {ACCESS_TOKEN_SECRET} = process.env;
        try {
            if (!await bcrypt.compare(password, user.password)) {
                throw new Error("Invalid password");
            }
            return sign({username: user.username}, ACCESS_TOKEN_SECRET);
        } catch (error) {
            throw error;
        }
    },
    async register(username, password) {
        try {
            const user = await userService.getUser(username);
            if (user) {
                throw new Error("User already exists");
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            return await userService.createUser(username, hashedPassword);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = authenticationService;