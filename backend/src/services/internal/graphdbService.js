const fetch = require("node-fetch");
const {
  convertToTurtle
} = require("../../utils/turtleConverter");
const Report = require("../../models/reportModel");
const { ResponseTypes, StatusCodes, ErrorMessages } = require("../../responses/apiConstants");

const GRAPHDB_ENDPOINT = process.env.GRAPHDB_ENDPOINT;

async function sendReportsToGraphDB() {
  try {
    const reports = await Report.find().populate("speciesId", "name").lean();

    const turtleData = convertToTurtle(reports);
    const response = await fetch(GRAPHDB_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "text/turtle",
      },
      body: turtleData,
    });

    if (!response.ok) throw new Error(`GraphDB Error: ${response.statusText}`);

    console.log("Data successfully sent to GraphDB!");
  } catch (error) {
    console.error("Failed to send data to GraphDB:", error);
  }
}

async function clearGraphDB(graphName = null) {
  try {
    const query = graphName ?
      `CLEAR GRAPH <${graphName}>` :
      `CLEAR ALL`;

    const response = await fetch(GRAPHDB_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `update=${encodeURIComponent(query)}`,
    });

    if (!response.ok) {
      throw new Error(`GraphDB Clear Error: ${response.statusText}`);
    }

    console.log(
      graphName ?
      `Graph <${graphName}> has been cleared successfully!` :
      "All graphs in the GraphDB have been cleared successfully!"
    );
  } catch (error) {
    console.error("Failed to clear GraphDB:", error);
  }
}

const SPARQL_ENDPOINT = process.env.SPARQL_ENDPOINT;

async function executeSPARQLQuery(query) {
  try {
    const response = await fetch(SPARQL_ENDPOINT, {
      method: "POST",
      headers: {
        'Accept': 'application/sparql-results+json',
        'Content-Type': 'application/sparql-query',
      },
      body: query,
    });

    if (!response.ok) {
      throw new Error(`SPARQL Query Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.results.bindings;
  } catch (error) {
    console.error("Error executing SPARQL query:", error);
    throw error;
  }
}

async function getTotalReports() {
    const query = `
        PREFIX ex: <http://example.org/>
        SELECT (COUNT(?report) AS ?totalReports)
        WHERE {
            ?report a ex:Report .
        }
    `;
    try {
        const result = await executeSPARQLQuery(query);
        const totalReports = parseInt(result[0].totalReports.value, 10);

        return {
            type: ResponseTypes.Success,
            status: StatusCodes.OK,
            data: totalReports,
        };
    } catch (error) {
        return {
            type: ResponseTypes.Error,
            status: StatusCodes.InternalServerError,
            error: ErrorMessages.UnexpectedErrorFetch,
        };
    }
};

const getMostReportedContinents = async () => {
    const query = `
        PREFIX ex: <http://example.org/>
        SELECT ?continent (COUNT(?report) AS ?count)
        WHERE {
            ?report a ex:Report ;
                    ex:continent ?continent .
        }
        GROUP BY ?continent
        ORDER BY DESC(?count)
        LIMIT 7
    `;
    try {
        const result = await executeSPARQLQuery(query);
        const continents = result.map((binding) => ({
            continent: binding.continent.value,
            count: parseInt(binding.count.value, 10),
        }));

        return {
            type: ResponseTypes.Success,
            status: StatusCodes.OK,
            data: continents,
        };
    } catch (error) {
        return {
            type: ResponseTypes.Error,
            status: StatusCodes.InternalServerError,
            error: ErrorMessages.UnexpectedErrorFetch,
        };
    }
};

const getMostReportedCountries = async () => {
    const query = `
        PREFIX ex: <http://example.org/>
        SELECT ?country (COUNT(?report) AS ?count)
        WHERE {
            ?report a ex:Report ;
                    ex:country ?country .
        }
        GROUP BY ?country
        ORDER BY DESC(?count)
        LIMIT 10
    `;
    try {
        const result = await executeSPARQLQuery(query);
        const countries = result.map((binding) => ({
            country: binding.country.value,
            count: parseInt(binding.count.value, 10),
        }));

        return {
            type: ResponseTypes.Success,
            status: StatusCodes.OK,
            data: countries,
        };
    } catch (error) {
        return {
            type: ResponseTypes.Error,
            status: StatusCodes.InternalServerError,
            error: ErrorMessages.UnexpectedErrorFetch,
        };
    }
};

const getReportsBySeason = async (season) => {
    const seasonToMonths = {
        spring: [3, 4, 5],
        summer: [6, 7, 8],
        autumn: [9, 10, 11],
        winter: [12, 1, 2],
    };

    const months = seasonToMonths[season].map((m) => `"${m}"^^<http://www.w3.org/2001/XMLSchema#integer>`).join(", ");

    const query = `
        PREFIX ex: <http://example.org/>
        SELECT (COUNT(?report) AS ?count)
        WHERE {
            ?report a ex:Report ;
                    ex:date ?date .
            BIND (MONTH(?date) AS ?month)
            FILTER(?month IN (${months}))
        }
    `;
    try {
        const result = await executeSPARQLQuery(query);
        const count = parseInt(result[0].count.value, 10);

        return {
            type: ResponseTypes.Success,
            status: StatusCodes.OK,
            data: { season, count },
        };
    } catch (error) {
        return {
            type: ResponseTypes.Error,
            status: StatusCodes.InternalServerError,
            error: ErrorMessages.UnexpectedErrorFetch,
        };
    }
};

const getTopReportedSpecies = async () => {
    const query = `
        PREFIX ex: <http://example.org/>
        SELECT ?species (COUNT(?report) AS ?count)
        WHERE {
            ?report a ex:Report ;
                    ex:speciesName ?species .
        }
        GROUP BY ?species
        ORDER BY DESC(?count)
        LIMIT 5
    `;
    try {
        const result = await executeSPARQLQuery(query);
        const species = result.map((binding) => ({
            species: binding.species.value,
            count: parseInt(binding.count.value, 10),
        }));

        return {
            type: ResponseTypes.Success,
            status: StatusCodes.OK,
            data: species,
        };
    } catch (error) {
        return {
            type: ResponseTypes.Error,
            status: StatusCodes.InternalServerError,
            error: ErrorMessages.UnexpectedErrorFetch,
        };
    }
};



module.exports = {
  sendReportsToGraphDB,
  clearGraphDB,
  getTotalReports,
  getMostReportedContinents,
  getMostReportedCountries,
  getReportsBySeason,
  getTopReportedSpecies,
};