import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Import JWT decoder
import MapView from "../../MapView";
import StatisticsView from "../../StatisticsView";
import SubmitReport from "../../SubmitReport";

const Home = () => {
  const [activeTab, setActiveTab] = useState("map");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      try {
        const decodedToken = jwtDecode(accessToken);
        setUser({
          userName: decodedToken.userName,
          email: decodedToken.email,
        });
      } catch (error) {
        console.error("Error decoding token:", error);
        handleLogout(); 
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  return (
    <div style={{ maxWidth: "900px", margin: "auto" }}>
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#282c34",
          padding: "10px",
          color: "white",
          borderRadius: "5px",
        }}
      >
        {user && (
          <div
            style={{
              backgroundColor: "#3b3f45",
              padding: "10px",
              borderRadius: "5px",
              textAlign: "left",
              color: "white",
            }}
          >
            <p style={{color:"white"}}>
              <strong style={{color:"#61dafb"}}>User:</strong> {user.userName}
            </p>
            <p style={{color:"white"}}>
              <strong style={{color:"#61dafb"}}>Email:</strong> {user.email}
            </p>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: "red",
                color: "white",
                border: "none",
                padding: "5px 10px",
                cursor: "pointer",
                borderRadius: "5px",
                marginTop: "5px",
              }}
            >
              Logout
            </button>
          </div>
        )}

        <div>
          <button
            onClick={() => setActiveTab("map")}
            style={{
              backgroundColor: activeTab === "map" ? "#61dafb" : "#3b3f45",
              color: "white",
              border: "none",
              padding: "8px 12px",
              margin: "5px",
              cursor: "pointer",
              borderRadius: "5px",
            }}
          >
            Map
          </button>
          <button
            onClick={() => setActiveTab("statistics")}
            style={{
              backgroundColor: activeTab === "statistics" ? "#61dafb" : "#3b3f45",
              color: "white",
              border: "none",
              padding: "8px 12px",
              margin: "5px",
              cursor: "pointer",
              borderRadius: "5px",
            }}
          >
            Statistics
          </button>
          <button
            onClick={() => setActiveTab("submitReport")}
            style={{
              backgroundColor: activeTab === "submitReport" ? "#61dafb" : "#3b3f45",
              color: "white",
              border: "none",
              padding: "8px 12px",
              margin: "5px",
              cursor: "pointer",
              borderRadius: "5px",
            }}
          >
            Submit Report
          </button>
        </div>
      </nav>

      <div style={{ padding: "15px" }}>
        {activeTab === "map" && <MapView />}
        {activeTab === "statistics" && <StatisticsView />}
        {activeTab === "submitReport" && <SubmitReport />}
      </div>
    </div>
  );
};

export default Home;
