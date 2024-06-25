
const userMapper = {
    mapDtoToModel: (dto) => {
        const { id, ...rest } = dto;
        return { _id: id, ...rest };
    },
    mapModelToDto: (model) => {
        const { _id, ...rest } = model.toObject ? model.toObject() : model;
        return { id: _id, ...rest };
    }
}

module.exports = userMapper

