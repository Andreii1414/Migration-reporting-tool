const Species = require('../../models/speciesModel');
const { ResponseTypes, StatusCodes, ErrorMessages } = require('../../responses/apiConstants');

const getSpecies = async () => {
    try {
        const species = await Species.find({}).exec();
        return {
            type: ResponseTypes.Success,
            status: StatusCodes.Ok,
            data: species,
        };
    } catch (error) {
        console.error('Error retrieving species:', error);
        return {
            type: ResponseTypes.Error,
            status: StatusCodes.InternalServerError,
            error: ErrorMessages.UnexpectedErrorGet,
        };
    }
};

module.exports = {
    getSpecies,
};