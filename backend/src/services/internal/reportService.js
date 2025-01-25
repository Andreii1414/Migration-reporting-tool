const Report = require('../../models/reportModel');
const { ResponseTypes, StatusCodes, ErrorMessages } = require('../../responses/apiConstants');

const createReport = async (reportData) => {
    try {
        const report = new Report(reportData);
        await report.save();
        return {
            type: ResponseTypes.Success,
            status: StatusCodes.Created,
            data: report,
        };
    } catch (error) {
        console.error('Error creating report:', error);
        return {
            type: ResponseTypes.Error,
            status: StatusCodes.InternalServerError,
            error: ErrorMessages.UnexpectedErrorCreate,
        };
    }
};

module.exports = {
    createReport,
};
