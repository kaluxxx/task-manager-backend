const accountMapper = {
    mapModelToDto: (model) => {
        const { _id, apiId, ...rest } = model.toObject ? model.toObject() : model;

        if (!apiId) {
            return { id: _id, ...rest };
        }

        const castedApiId =  apiId.toString();
        return { id: _id, apiId: castedApiId, ...rest };
    },
    mapModelsToDtos: (models) => models.map((model) => accountMapper.mapModelToDto(model)),
    mapDtoToModel: (dto) => {
        const { id, ...rest } = dto;
        return { _id: id, ...rest };
    },
    mapDtosToModels: (dtos) => dtos.map((dto) => accountMapper.mapDtoToModel(dto)),
}

module.exports = accountMapper

