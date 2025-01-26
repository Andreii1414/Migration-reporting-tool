const ApiResponse = require("../responses/apiResponse");
const statisticsService = require("../services/internal/statisticsService");
const { ErrorMessages, StatusCodes } = require("../responses/apiConstants");

const getTotalReports = async (req, res) => {
    try{
        const results = await statisticsService.getTotalReports();
        res.json(results);
    }
    catch (error){
        console.log(error);
        ApiResponse.error(res, {
            statusCode: StatusCodes.InternalServerError,
            error: ErrorMessages.UnexpectedErrorGet,
        });
    }
};

const getMostReportedContinents = async (req, res) => {
    try{
        const results = await statisticsService.getMostReportedContinents();
        res.json(results);
    }
    catch (error){
        console.log(error);
        ApiResponse.error(res, {
            statusCode: StatusCodes.InternalServerError,
            error: ErrorMessages.UnexpectedErrorGet,
        });
    }
}

const getMostReportedCountries = async (req, res) => {
    try{
        const results = await statisticsService.getMostReportedCountries();
        res.json(results);
    }
    catch (error){
        console.log(error);
        ApiResponse.error(res, {
            statusCode: StatusCodes.InternalServerError,
            error: ErrorMessages.UnexpectedErrorGet,
        });
    }
}

const getReportsBySeason = async (req, res) => {
    try{
        const results = await statisticsService.getReportsBySeason(req.params.season);
        res.json(results);
    }
    catch (error){
        console.log(error);
        ApiResponse.error(res, {
            statusCode: StatusCodes.InternalServerError,
            error: ErrorMessages.UnexpectedErrorGet,
        });
    }
};

const getTopReportedSpecies = async (req, res) => {
    try{
        const results = await statisticsService.getTopReportedSpecies();
        res.json(results);
    }
    catch (error){
        console.log(error);
        ApiResponse.error(res, {
            statusCode: StatusCodes.InternalServerError,
            error: ErrorMessages.UnexpectedErrorGet,
        });
    }
};

module.exports = {
    getTotalReports,
    getMostReportedContinents,
    getMostReportedCountries,
    getReportsBySeason,
    getTopReportedSpecies,
};