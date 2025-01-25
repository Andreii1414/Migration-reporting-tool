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

module.exports = {
    createReport,
};
