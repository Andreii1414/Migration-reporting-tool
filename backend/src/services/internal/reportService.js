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

const getReportsBySeasonAndSpecies = async (season, speciesId) => {
    try{
        const seasonToMonths = {
            "spring": [3, 4, 5],
            "summer": [6, 7, 8],
            "autumn": [9, 10, 11],
            "winter": [12, 1, 2],
        };
        const months = seasonToMonths[season];
        const filter = {
            $expr: {
                $in: [{ $month: "$date" }, months],
            },
        };
        if(speciesId) {
            filter.speciesId = speciesId;
        }
        
        const reports = await Report.find(filter);
        return {
            type: ResponseTypes.Success,
            status: StatusCodes.OK,
            data: reports,
        };
    } catch (error) {
    console.error('Error fetching reports by season and species:', error);
    return {
        type: ResponseTypes.Error,
        status: StatusCodes.InternalServerError,
        error: ErrorMessages.UnexpectedErrorFetch,
    };
}
};

module.exports = {
    createReport,
    getReportsBySeasonAndSpecies,
};
