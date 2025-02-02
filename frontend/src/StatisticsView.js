import React, { useState, useEffect } from "react";
import "./StatisticsView.css";
import { FaChartBar, FaList, FaClipboardList, FaDownload } from "react-icons/fa";
import {CLIENT_URL, SERVER_URL} from "./config"

const StatisticsView = () => {
  const [data, setData] = useState({
    totalReports: null,
    reportsBySeason: {},
    mostReportedContinents: [],
    mostReportedCountries: [],
    top5Species: []
  });
  const [loading, setLoading] = useState(true);
  const [customQuery, setCustomQuery] = useState("");
  const [customQueryResult, setCustomQueryResult] = useState(null);
  const [customQueryError, setCustomQueryError] = useState(null);
  const [resultTooLarge, setResultTooLarge] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const totalReportsRes = await fetch(`${SERVER_URL}/api/sparql/total-reports`);
        const totalReportsData = await totalReportsRes.json();

        const continentsRes = await fetch(`${SERVER_URL}/api/sparql/most-reported-continents`);
        const continentsData = await continentsRes.json();

        const countriesRes = await fetch(`${SERVER_URL}/api/sparql/most-reported-countries`);
        const countriesData = await countriesRes.json();

        const seasons = ["spring", "summer", "autumn", "winter"];
        const seasonsData = {};
        for (const season of seasons) {
          const seasonRes = await fetch(`${SERVER_URL}/api/sparql/report-by-season/${season}`);
          const seasonData = await seasonRes.json();
          seasonsData[season] = seasonData.data.count;
        }

        const speciesRes = await fetch(`${SERVER_URL}/api/sparql/top-reported-species`);
        const speciesData = await speciesRes.json();

        setData({
          totalReports: totalReportsData.data,
          reportsBySeason: seasonsData,
          mostReportedContinents: continentsData.data,
          mostReportedCountries: countriesData.data,
          top5Species: speciesData.data
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    fetchData();
  }, []);

  const handleCustomQuery = async () => {
    try {
      const encodedQuery = encodeURIComponent(customQuery);
      const response = await fetch(`${SERVER_URL}/api/sparql/custom-query?query=${encodedQuery}`);

      if (!response.ok) {
        throw new Error("Failed to fetch query results");
      }

      const result = await response.json();
      const length = JSON.stringify(result.data).length;
      setResultTooLarge(length > 2000);
      console.log(length);
      setCustomQueryResult(result.data);
      setCustomQueryError(null);
    } catch (error) {
      setCustomQueryError(error.message);
      setCustomQueryResult(null);
    }
  };

  const downloadJsonFile = () => {
    const jsonBlob = new Blob([JSON.stringify(customQueryResult, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(jsonBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "custom_query_result.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  if (loading) {
    return <div>Loading statistics...</div>;
  }

  const seasonQueries = {
    summer: `
      PREFIX ex: <http://example.org/>
      SELECT (COUNT(?report) AS ?count)
      WHERE {
        ?report a ex:Report ;
                ex:date ?date .
        BIND (MONTH(?date) AS ?month)
        FILTER(?month IN (6, 7, 8))
      }
    `,
    spring: `
      PREFIX ex: <http://example.org/>
      SELECT (COUNT(?report) AS ?count)
      WHERE {
        ?report a ex:Report ;
                ex:date ?date .
        BIND (MONTH(?date) AS ?month)
        FILTER(?month IN (3, 4, 5))
      }
    `,
    autumn: `
      PREFIX ex: <http://example.org/>
      SELECT (COUNT(?report) AS ?count)
      WHERE {
        ?report a ex:Report ;
                ex:date ?date .
        BIND (MONTH(?date) AS ?month)
        FILTER(?month IN (9, 10, 11))
      }
    `,
    winter: `
      PREFIX ex: <http://example.org/>
      SELECT (COUNT(?report) AS ?count)
      WHERE {
        ?report a ex:Report ;
                ex:date ?date .
        BIND (MONTH(?date) AS ?month)
        FILTER(?month IN (12, 1, 2))
      }
    `
  };

  const totalReportsQuery = `
    PREFIX ex: <http://example.org/>
    SELECT (COUNT(?report) AS ?totalReports)
    WHERE {
        ?report a ex:Report .
    }
  `;

  const reportsByContinentQuery = `
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

  const reportsByCountryQuery = `
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

  const topReportedSpeciesQuery = `
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

  const rdfDataExample =`
    @prefix ex: <http://example.org/> .
    @prefix xsd: <http://www.w3.org/2001/XMLSchema#>

    ex:report6795fe2c11f84dd7768b8a49 a ex:Report ;
        ex:title "Dalmatian pelican" ;
        ex:date "2025-01-24T13:25:18.000Z"^^xsd:dateTime ;
        ex:species ex:species6795354de4ff5eea0eb695fe ;
        ex:speciesName "pelicans";
        ex:description "Dalmatian pelican in Lake Kerkini" ;
        ex:imageUrl "www.example.com" ;
        ex:latitude "41.165473"^^xsd:float ;
        ex:longitude "23.203811"^^xsd:float ;
        ex:continent "Europe" ;
        ex:country "Greece" .


    ex:report6795fe2c11f84dd7768b8a2b a ex:Report ;
        ex:title "Sleepy ducks" ;
        ex:date "2025-01-25T06:31:54.000Z"^^xsd:dateTime ;
        ex:species ex:species679534d4e4ff5eea0eb695f8 ;
        ex:speciesName "ducks";
        ex:description "Australian wood ducks" ;
        ex:imageUrl "www.example.com" ;
        ex:latitude "-34.409441"^^xsd:float ;
        ex:longitude "150.898879"^^xsd:float ;
        ex:continent "Australian continent" ;
        ex:country "Australia" .`

  return (
    <div className="statistics-container">
      <h2>General Statistics</h2>
      <StatBox
        icon={<FaClipboardList />}
        label="Total Reports"
        sparqlQuery={totalReportsQuery}
        value={
          <>
            Our database contains a total of <strong>{data.totalReports} reports</strong> collected from users and social media platforms, helping us track wildlife distribution across the globe.
          </>
        }
      />

      <h2>Geographically Grouped</h2>
      <StatBox
        label="Reports by Continent"
        sparqlQuery={reportsByContinentQuery}
        value={
          <ul className="numbered-list">
            {data.mostReportedContinents.map(({ continent, count }, index) => (
              <li key={continent}>
                <span>{index + 1}. </span>
                <strong>{continent}:</strong> {count} reports
              </li>
            ))}
          </ul>
        }
        className="continent-country-stat"
      />

      <StatBox
        label="Top 10 Reported Countries"
        sparqlQuery={reportsByCountryQuery}
        value={
          <ul className="numbered-list">
            {data.mostReportedCountries.map(({ country, count }, index) => (
              <li key={country}>
                <span>{index + 1}. </span>
                <strong>{country}:</strong> {count} reports
              </li>
            ))}
          </ul>
        }
        className="continent-country-stat"
      />

      <h2>Reports by Season</h2>
      {Object.entries(data.reportsBySeason).map(([season, count]) => (
        <StatBox
          key={season}
          icon={<FaChartBar />}
          label={`${season.charAt(0).toUpperCase() + season.slice(1)} Reports`}
          sparqlQuery={seasonQueries[season]}
          value={
            <>
              During {season.toLowerCase()}, a total of <strong>{count} reports</strong> were recorded, helping us understand seasonal wildlife activity.
            </>
          }
        />
      ))}

      <h2>Top Reported Species</h2>
      {data.top5Species.map(({ name, count }, index) => (
        <StatBox
          key={name}
          icon={<FaList />}
          label={`#${index + 1} Reported Species`}
          sparqlQuery={topReportedSpeciesQuery} 
          value={
            <>
              One of the most commonly reported species is the <strong>{name}</strong>, with <strong>{count}</strong> observations.
            </>
          }
        />
      ))}

      <h2>Create Your Own Statistics</h2>
      <div className="custom-query-container">
        <div className="input-example-row">
          <textarea
            className="custom-query-input"
            value={customQuery}
            onChange={(e) => setCustomQuery(e.target.value)}
            placeholder="Write your SPARQL query here..."
          />
          <div className="example-data">
            <strong>Example RDF Data:</strong>
            <pre>{rdfDataExample}</pre>
          </div>
        </div>
        
        <button onClick={handleCustomQuery}>Run Query</button>
        
        {customQueryError && <div className="error">Error: {customQueryError}</div>}
        
        {customQueryResult && (
        <div className="query-result">
          <strong>Query Result:</strong>
          {resultTooLarge ? (
            <p>Result is too large to display. Download the file instead.</p>
          ) : (
            <pre>{JSON.stringify(customQueryResult, null, 2)}</pre>
          )}
          <button onClick={downloadJsonFile} className="download-btn">
            <FaDownload /> Download JSON
          </button>
        </div>
      )}
      </div>


    </div>
  );
};

const StatBox = ({ icon, label, value, sparqlQuery }) => {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div
      className="stat-box"
      onMouseEnter={() => setShowPopup(true)}
      onMouseLeave={() => setShowPopup(false)} 
    >
      <div className="icon-box">{icon && icon}</div>
      <div className="text-box">
        <strong>{label}:</strong> {value}
      </div>

      {showPopup && (
        <div className="popup">
          <pre>{sparqlQuery}</pre>
        </div>
      )}
    </div>
  );
};


export default StatisticsView;
