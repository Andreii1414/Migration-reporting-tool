import React, { useState } from "react";
import "./App.css";
import MapView from "./MapView";
import StatisticsView from "./StatisticsView";
import SubmitReport from "./SubmitReport";

const App = () => {
  const [activeTab, setActiveTab] = useState("map");

  return (
    <div className="container">
      <nav className="navbar">
        <button 
          onClick={() => setActiveTab("map")} 
          className={activeTab === "map" ? "active" : ""}
        >
          Map
        </button>
        <button 
          onClick={() => setActiveTab("statistics")} 
          className={activeTab === "statistics" ? "active" : ""}
        >
          Statistics
        </button>
        <button 
          onClick={() => setActiveTab("submitReport")} 
          className={activeTab === "submitReport" ? "active" : ""}
        >
          Submit Report
        </button>
      </nav>
      <div className="content">
        {activeTab === "map" && <MapView />}
        {activeTab === "statistics" && <StatisticsView />}
        {activeTab === "submitReport" && <SubmitReport />}
      </div>
    </div>
  );
};

export default App;
