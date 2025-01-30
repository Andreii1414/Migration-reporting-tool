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
    
const getSpeciesById = async (req, res) => {
    try {
        const { id } = req.params;
        const species = await speciesService.getSpeciesById(id);
        apiResponse.handleResponse(res, species);
    } catch (error) {
        console.log(error);
        apiResponse.error(res, {
        statusCode: StatusCodes.InternalServerError,
        error: ErrorMessages.UnexpectedErrorGet,
        });
    }
    };

const createSpecies = async (req, res) => {
    try {
        const species = await speciesService.createSpecies(req.body);
        apiResponse.handleResponse(res, species);
    } catch (error) {
        console.log(error);
        apiResponse.error(res, {
        statusCode: StatusCodes.InternalServerError,
        error: ErrorMessages.UnexpectedErrorCreate,
        });
    }
    }

const updateSpecies = async (req, res) => {
    try {
        const { id } = req.params;
        const species = await speciesService.updateSpecies(id, req.body);
        apiResponse.handleResponse(res, species);
    } catch (error) {
        console.log(error);
        apiResponse.error(res, {
        statusCode: StatusCodes.InternalServerError,
        error: ErrorMessages.UnexpectedErrorUpdate,
        });
    }
    }

const deleteSpecies = async (req, res) => {
    try {
        const { id } = req.params;
        const species = await speciesService.deleteSpecies(id);
        apiResponse.handleResponse(res, species);
    } catch (error) {
        console.log(error);
        apiResponse.error(res, {
        statusCode: StatusCodes.InternalServerError,
        error: ErrorMessages.UnexpectedErrorDelete,
        });
    }
    }


module.exports = {
    getSpecies,
    getSpeciesById,
    createSpecies,
    updateSpecies,
    deleteSpecies,
};