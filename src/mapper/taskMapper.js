const accountMapper = require("./accountMapper");
const fileMapper = require("./fileMapper");
const userMapper = require("./userMapper");

const taskMapper = {
    mapModelToDto: (model) => {
        const { _id, accounts, ...rest } = model.toObject ? model.toObject() : model;
        rest.accounts = accountMapper.mapModelsToDtos(accounts);
        if (rest.image) {
            rest.image = fileMapper.mapModelToDto(rest.image);
        }
        return { id: _id, ...rest };
    },
    mapModelsToDtos: (models) => models.map((model) => taskMapper.mapModelToDto(model)),
    mapDtoToModel: ({ name, accounts, channels, message, resendInterval, user }) => {
        accounts = accountMapper.mapDtosToModels(accounts);
        return { name, accounts, channels, message, resendInterval, user };
    },
}

module.exports = taskMapper

