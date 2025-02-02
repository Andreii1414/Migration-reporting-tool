const ApiResponse = require("../responses/apiResponse");
const dataService = require("../services/internal/dataService");
const { ErrorMessages, StatusCodes } = require("../responses/apiConstants");

const getData = async (req, res) => {
  try {
    const results = await dataService.getData();
    res.json(results);
  } catch (error) {
    console.log(error);
    ApiResponse.error(res, {
      statusCode: StatusCodes.InternalServerError,
      error: ErrorMessages.UnexpectedErrorGet,
    });
  }
};

module.exports = {
  getData,
};
