import React, { useState } from "react";
import "./StatisticsView.css";
import { FaChartBar, FaGlobe, FaList, FaClipboardList } from "react-icons/fa";

const StatisticsView = () => {
  const [data] = useState({
    totalReports: 120,
    reportsBySeason: {
      Spring: 30,
      Summer: 25,
      Autumn: 40,
      Winter: 25
    },
    mostReportedContinent: "Europe",
    mostReportedCountry: "Germany",
    top5Species: ["Red Fox", "Brown Bear", "Grey Wolf", "European Bison", "Eurasian Lynx"]
  });

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
        icon={<FaGlobe />} 
        label="Most Reported Continent" 
        value={
            <>
                The continent with the highest number of reports is <strong>{data.mostReportedContinent}</strong>, indicating significant wildlife presence and user engagement.
            </>
        } 
      />
      <StatBox 
        icon={<FaGlobe />} 
        label="Most Reported Country" 
        value={
            <>
            The country with the most reports is <strong>{data.mostReportedCountry}</strong>, showing a strong interest in biodiversity monitoring.
            </>
        } 
      />

      <h2>Reports by Season</h2>
      {Object.entries(data.reportsBySeason).map(([season, count]) => (
        <StatBox 
          key={season} 
          icon={<FaChartBar />} 
          label={`${season} Reports`} 
          value={
            <>
            During ${season.toLowerCase()}, a total of <strong>{count} reports</strong> were recorded, helping us understand seasonal wildlife activity.
            </>
          } 
        />
      ))}

      <h2>Top Reported Species</h2>
      {data.top5Species.map((species, index) => (
        <StatBox 
          key={species} 
          icon={<FaList />} 
          label={`#${index + 1} Reported Species`} 
          value={
            <>
            One of the most commonly reported species is the <strong>{species}</strong>, frequently observed in various environments.
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
      <div className="icon-box">{icon}</div>
      <div className="text-box">
        <strong>{label}:</strong> {value}
      </div>
    </div>
  );
};

export default StatisticsView;
