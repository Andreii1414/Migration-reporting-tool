const apiResponse = require("../responses/apiResponse");
const reportService = require("../services/internal/reportService");
const { ErrorMessages, StatusCodes } = require("../responses/apiConstants");

const createReport = async (req, res) => {
    try {
        const userId = req.currentUser?.userId || null;
        const {
            title,
            description,
            date,
            speciesId,
            imageUrl,
            latitude,
            longitude,
          } = req.body;

          const payload = {
            title,
            description,
            date,
            speciesId,
            imageUrl,
            latitude,
            longitude,
          };

          if (userId) {
            payload.userId = userId;
          }
    
        const report = await reportService.createReport(payload);
        apiResponse.handleResponse(res, report);
    } catch (error) {
        console.log(error);
        apiResponse.error(res, {
        statusCode: StatusCodes.InternalServerError,
        error: ErrorMessages.UnexpectedErrorCreate,
        });
    }
    };

    const getReportsBySeasonAndSpecies = async (req, res) => {
      try {
          const { season, speciesId } = req.query;
  
          if (!season) {
              return apiResponse.error(res, {
                  statusCode: StatusCodes.BadRequest,
                  error: "Season is required",
              });
          }
          const reports = await reportService.getReportsBySeasonAndSpecies(season, speciesId);
          apiResponse.handleResponse(res, reports);
      } catch (error) {
          console.error(error);
          apiResponse.error(res, {
              statusCode: StatusCodes.InternalServerError,
              error: ErrorMessages.UnexpectedErrorFetch,
          });
      }
  };

module.exports = {
    createReport,
    getReportsBySeasonAndSpecies,
};
