const ApiResponse = require("../responses/apiResponse");
const graphdbService = require("../services/internal/graphdbService");
const { ErrorMessages, StatusCodes } = require("../responses/apiConstants");

const getTotalReports = async (req, res) => {
    try{
        const results = await graphdbService.getTotalReports();
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

const getMostReportedContinents = async (req, res) => {
    try {
        const results = await graphdbService.getMostReportedContinents();
        res.json(results);
    } catch (error) {
        console.error(error);
        ApiResponse.error(res, {
            statusCode: StatusCodes.InternalServerError,
            error: ErrorMessages.UnexpectedErrorGet,
        });
    }
};

const getMostReportedCountries = async (req, res) => {
    try {
        const results = await graphdbService.getMostReportedCountries();
        res.json(results);
    } catch (error) {
        console.error(error);
        ApiResponse.error(res, {
            statusCode: StatusCodes.InternalServerError,
            error: ErrorMessages.UnexpectedErrorGet,
        });
    }
};

const getReportsBySeason = async (req, res) => {
    try {
        const { season } = req.params;
        const results = await graphdbService.getReportsBySeason(season);
        res.json(results);
    } catch (error) {
        console.error(error);
        ApiResponse.error(res, {
            statusCode: StatusCodes.InternalServerError,
            error: ErrorMessages.UnexpectedErrorGet,
        });
    }
}

const getTopReportedSpecies = async (req, res) => {
    try {
        const results = await graphdbService.getTopReportedSpecies();
        res.json(results);
    } catch (error) {
        console.error(error);
        ApiResponse.error(res, {
            statusCode: StatusCodes.InternalServerError,
            error: ErrorMessages.UnexpectedErrorGet,
        });
    }
};
const customQuery = async (req, res) => {
    try {
      const query = req.query.query;
      if (!query) {
        return res.status(400).json({ error: "SPARQL query is required" });
      }
      const results = await graphdbService.customQuery(query);
      res.status(200).json({
        data: results,
      });
    } catch (error) {
      console.error("Error executing SPARQL query:", error);
      res.status(500).json({
        error: "An error occurred while executing the SPARQL query",
      });
    }
  };
  

module.exports = {
    getTotalReports,
    getMostReportedContinents,
    getMostReportedCountries,
    getReportsBySeason,
    getTopReportedSpecies,
    customQuery,
};