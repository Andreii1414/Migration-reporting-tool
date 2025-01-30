require("dotenv").config();
const ApiResponse = require("../responses/apiResponse");
const { StatusCodes, TokenMessages } = require("../responses/apiConstants");

const restrictAccess = (req, res, next) => {
    const internalSecret  = req.headers["x-internal-secret"];
    if (internalSecret !== process.env.INTERNAL_SECRET) {
        return ApiResponse.error(res, {
        statusCode: StatusCodes.Forbidden,
        error: TokenMessages.InvalidInternalSecret,
        });
    }
    next();
};

module.exports = {
    restrictAccess,
};
