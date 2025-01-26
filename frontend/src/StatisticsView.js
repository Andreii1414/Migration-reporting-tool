import React, { useState, useEffect } from "react";
import "./StatisticsView.css";
import { FaChartBar, FaList, FaClipboardList } from "react-icons/fa";

const StatisticsView = () => {
  const [data, setData] = useState({
    totalReports: null,
    reportsBySeason: {},
    mostReportedContinents: [],
    mostReportedCountries: [],
    top5Species: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const totalReportsRes = await fetch("http://localhost:5000/api/sparql/total-reports");
        const totalReportsData = await totalReportsRes.json();

        const continentsRes = await fetch("http://localhost:5000/api/sparql/most-reported-continents");
        const continentsData = await continentsRes.json();

        const countriesRes = await fetch("http://localhost:5000/api/sparql/most-reported-countries");
        const countriesData = await countriesRes.json();

        const seasons = ["spring", "summer", "autumn", "winter"];
        const seasonsData = {};
        for (const season of seasons) {
          const seasonRes = await fetch(`http://localhost:5000/api/sparql/report-by-season/${season}`);
          const seasonData = await seasonRes.json();
          seasonsData[season] = seasonData.data.count;
        }

        const speciesRes = await fetch("http://localhost:5000/api/sparql/top-reported-species");
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

  if (loading) {
    return <div>Loading statistics...</div>;
  }

  return (
    <div className="statistics-container">
      <h2>General Statistics</h2>
      <StatBox 
        icon={<FaClipboardList />} 
        label="Total Reports" 
        value={
          <>
            Our database contains a total of <strong>{data.totalReports} reports</strong> collected from users and social media platforms, helping us track wildlife distribution across the globe.
          </>
        }
      />

      <h2>Geographically Grouped</h2>
      <StatBox 
        label="Reports by Continent"
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
          value={
            <>
              One of the most commonly reported species is the <strong>{name}</strong>, with <strong>{count}</strong> observations.
            </>
          } 
        />
      ))}
    </div>
  );
};

const StatBox = ({ icon, label, value }) => {
  return (
    <div className="stat-box">
      <div className="icon-box">{icon && icon}</div>
      <div className="text-box">
        <strong>{label}:</strong> {value}
      </div>
    </div>
  );
};

export default StatisticsView;
