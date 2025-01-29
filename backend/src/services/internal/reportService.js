const Report = require('../../models/reportModel');
const { ResponseTypes, StatusCodes, ErrorMessages } = require('../../responses/apiConstants');
const axios = require('axios');
const { sendReportsToGraphDB, clearGraphDB } = require('./graphDBService');

async function getLocationData(lat, lon) {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode?latitude=${lat}&longitude=${lon}&localityLanguage=en&key=${process.env.BIGDATACLOUD_API_KEY}`;
    try {
        const response = await axios.get(url);
        const data = response.data;

        if (data) {
            return {
                country: data.countryName || "Unknown",
                continent: data.continent || "Unknown",
            };
        }
    } catch (error) {
        console.error("Error fetching geolocation data:", error.message);
    }
    return { country: "Unknown", continent: "Unknown" };
}


const createReport = async (reportData) => {
    try {
        const locationData = await getLocationData(reportData.latitude, reportData.longitude);
        const report = new Report({
            title: reportData.title,
            description: reportData.description,
            date: reportData.date,
            speciesId: reportData.speciesId,
            imageUrl: reportData.imageUrl,
            latitude: reportData.latitude,
            longitude: reportData.longitude,
            country: locationData.country,
            continent: locationData.continent,
        });
        await report.save();

        await clearGraphDB();
        await sendReportsToGraphDB();

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
        if(speciesId != "All species" && speciesId != null) {
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
