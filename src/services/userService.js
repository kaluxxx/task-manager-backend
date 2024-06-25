const User = require("../models/user");

const userService = {
    getUser: async (username) => {
        try {
            return await User.findOne({ username});
        } catch (error) {
            throw error;
        }
    },
    createUser: async (username, password) => {
        try {
            const user = new User({
                username,
                password
            });
            await user.save();
        } catch (error) {
            throw error;
        }
    },
}

module.exports = userService;