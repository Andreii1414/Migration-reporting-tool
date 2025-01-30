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

const getSpeciesById = async (id) => {
    try {
        const species = await Species.findById(id).exec();
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

const createSpecies = async (speciesData) => {
    try {
        const species = new Species(speciesData);
        await species.save();
        return {
            type: ResponseTypes.Success,
            status: StatusCodes.Created,
            data: species,
        };
    } catch (error) {
        console.error('Error creating species:', error);
        return {
            type: ResponseTypes.Error,
            status: StatusCodes.InternalServerError,
            error: ErrorMessages.UnexpectedErrorCreate,
        };
    }
}

const updateSpecies = async (id, speciesData) => {
    try {
        const species = await Species.findByIdAndUpdate
        (id, speciesData, { new: true }).exec();
        return {
            type: ResponseTypes.Success,
            status: StatusCodes.Ok,
            data: species,
        };
    }
    catch (error) {
        console.error('Error updating species:', error);
        return {
            type: ResponseTypes.Error,
            status: StatusCodes.InternalServerError,
            error: ErrorMessages.UnexpectedErrorUpdate,
        };
    }
}

const deleteSpecies = async (id) => {
    try {
        const species = await Species.findByIdAndDelete(id).exec();
        return {
            type: ResponseTypes.Success,
            status: StatusCodes.Ok,
            data: species,
        };
    } catch (error) {
        console.error('Error deleting species:', error);
        return {
            type: ResponseTypes.Error,
            status: StatusCodes.InternalServerError,
            error: ErrorMessages.UnexpectedErrorDelete,
        };
    }
}



module.exports = {
    getSpecies,
    getSpeciesById,
    createSpecies,
    updateSpecies,
    deleteSpecies,
};