const Report = require("../../models/reportModel");
const Species = require("../../models/speciesModel");
const {
  ResponseTypes,
  StatusCodes,
  ErrorMessages,
} = require("../../responses/apiConstants");

const getTotalReports = async () => {
  try {
    const totalReports = await Report.countDocuments();
    return {
      type: ResponseTypes.Success,
      status: StatusCodes.OK,
      data: totalReports,
    };
  } catch (error) {
    console.error("Error fetching total reports:", error);
    return {
      type: ResponseTypes.Error,
      status: StatusCodes.InternalServerError,
      error: ErrorMessages.UnexpectedErrorFetch,
    };
  }
};

const getMostReportedContinents = async () => {
  try {
    const mostReportedContinent = await Report.aggregate([
      {
        $group: {
          _id: "$continent",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 7,
      },
    ]);
    return {
      type: ResponseTypes.Success,
      status: StatusCodes.OK,
      data: mostReportedContinent,
    };
  } catch (error) {
    console.error("Error fetching most reported continent:", error);
    return {
      type: ResponseTypes.Error,
      status: StatusCodes.InternalServerError,
      error: ErrorMessages.UnexpectedErrorFetch,
    };
  }
};

const getMostReportedCountries = async () => {
  try {
    const mostReportedCountry = await Report.aggregate([
      {
        $group: {
          _id: "$country",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 10,
      },
    ]);
    return {
      type: ResponseTypes.Success,
      status: StatusCodes.OK,
      data: mostReportedCountry,
    };
  } catch (error) {
    console.error("Error fetching most reported country:", error);
    return {
      type: ResponseTypes.Error,
      status: StatusCodes.InternalServerError,
      error: ErrorMessages.UnexpectedErrorFetch,
    };
  }
};

const getReportsBySeason = async (season) => {
  try {
    const seasonToMonths = {
      spring: [3, 4, 5],
      summer: [6, 7, 8],
      autumn: [9, 10, 11],
      winter: [12, 1, 2],
    };
    const months = seasonToMonths[season];
    const filter = {
      $expr: {
        $in: [{ $month: "$date" }, months],
      },
    };
    const count = await Report.countDocuments(filter);

    return {
      type: ResponseTypes.Success,
      status: StatusCodes.OK,
      data: { season, count },
    };
  } catch (error) {
    console.error("Error fetching reports by season:", error);
    return {
      type: ResponseTypes.Error,
      status: StatusCodes.InternalServerError,
      error: ErrorMessages.UnexpectedErrorFetch,
    };
  }
};

const getTopReportedSpecies = async () => {
  try {
    const topReportedSpecies = await Report.aggregate([
      {
        $group: {
          _id: "$speciesId",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    for (const species of topReportedSpecies) {
      const speciesData = await Species.findById(species._id);
      species.name = speciesData.name;
    }

    return {
      type: ResponseTypes.Success,
      status: StatusCodes.OK,
      data: topReportedSpecies,
    };
  } catch (error) {
    console.error("Error fetching top reported species:", error);
    return {
      type: ResponseTypes.Error,
      status: StatusCodes.InternalServerError,
      error: ErrorMessages.UnexpectedErrorFetch,
    };
  }
};

module.exports = {
  getTotalReports,
  getMostReportedContinents,
  getMostReportedCountries,
  getReportsBySeason,
  getTopReportedSpecies,
};
