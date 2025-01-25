const apiResponse = require("../responses/apiResponse");
const speciesService = require("../services/internal/speciesService");
const { ErrorMessages, StatusCodes } = require("../responses/apiConstants");

const getSpecies = async (req, res) => {
    try {
        const species = await speciesService.getSpecies();
        apiResponse.handleResponse(res, species);
    } catch (error) {
        console.log(error);
        apiResponse.error(res, {
        statusCode: StatusCodes.InternalServerError,
        error: ErrorMessages.UnexpectedErrorGet,
        });
    }
    };
    

module.exports = {
    getSpecies,
};