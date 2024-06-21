const fileMapper = {
    mapModelToDto: (model) => {
        const { _id, ...rest } = model.toObject ? model.toObject() : model;
        return { id: _id, ...rest };
    },
}

module.exports = fileMapper