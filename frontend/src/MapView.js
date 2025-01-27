import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MapView.css";

const DynamicIcon = ({ zoom }) => {
  const size = Math.max(15, zoom * 2);
  return L.icon({
    iconUrl: "https://img.icons8.com/?size=100&id=118575&format=png&color=000000",
    iconSize: [size, size * 1.5],
    iconAnchor: [size / 2, size * 1.5],
    popupAnchor: [1, -size],
  });
};

const MapView = () => {
  const [season, setSeason] = useState("Spring");
  const [species, setSpecies] = useState("");
  const [availableSpecies, setAvailableSpecies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [markers, setMarkers] = useState([]);
  const [zoom, setZoom] = useState(3);

  const fetchSpecies = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/species");
      if (!response.ok) {
        throw new Error("Failed to fetch species");
      }
      const data = await response.json();
      
      const speciesList = [
        { id: null, name: "All species" },
        ...data.data.map((item) => ({
          id: item._id,
          name: item.name.replace(/\b\w/g, (char) => char.toUpperCase()),
        })),
      ];
      speciesList.sort((a, b) => a.name.localeCompare(b.name));
      return speciesList;
    } catch (error) {
      console.error("Error fetching species:", error);
      return [];
    }
  };

  useEffect(() => {
    const loadSpecies = async () => {
      const speciesList = await fetchSpecies();
      setAvailableSpecies(speciesList);
      setSpecies(speciesList.length ? speciesList[0].id : null);
    };

    loadSpecies();
  }, []);

  const filteredSpecies = availableSpecies.filter((specie) =>
    specie.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchReports = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/reports?season=${season.toLowerCase()}${
          species ? `&speciesId=${species}` : ""
        }`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch reports");
      }
      
      const data = await response.json();
      const reports = data.data.map((report) => {
        const speciesMatch = availableSpecies.find((s) => s.id === report.speciesId);
        const speciesName = speciesMatch ? speciesMatch.name : "Unknown";
  
        return {
          title: report.title,
          description: report.description,
          image: report.imageUrl,
          species: speciesName,
          date_taken: new Date(report.date).toISOString().split("T")[0],
          latitude: report.latitude,
          longitude: report.longitude,
        };
      });
  
      return reports;
    } catch (error) {
      console.error("Error fetching reports:", error);
      return [];
    }
  };

  const generateMarkers = async () => {
    const reports = await fetchReports();
    setMarkers(reports);
  };

  return (
    <div className="map-container">
      <div className="filter-bar">
        <div className="species-group">
          <label>Season:</label>
          <select value={season} onChange={(e) => setSeason(e.target.value)}>
            <option value="Spring">Spring</option>
            <option value="Summer">Summer</option>
            <option value="Autumn">Autumn</option>
            <option value="Winter">Winter</option>
          </select>
        </div>

        <div className="species-group">
          <label>Species:</label>
          <input
            type="text"
            placeholder="Search species..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {filteredSpecies.length > 0 ? (
            <select
              value={species}
              onChange={(e) => setSpecies(e.target.value)}
            >
              {filteredSpecies.map((specie) => (
                <option key={specie.id} value={specie.id}>
                  {specie.name}
                </option>
              ))}
            </select>
          ) : (
            <span className="error-message">No species found.</span>
          )}
        </div>

        {filteredSpecies.length > 0 && (
          <button className="update-button" onClick={generateMarkers}>
            Update Map
          </button>
        )}
      </div>

      <MapContainer
        center={[20, 0]}
        zoom={zoom}
        className="map-box"
        whenCreated={(map) =>
          map.on("zoomend", () => setZoom(map.getZoom()))
        }
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={[marker.latitude, marker.longitude]}
            icon={DynamicIcon({ zoom })}
          >
            <Popup>
              <strong>
                Title:{" "}
                {marker.title.length > 50
                  ? `${marker.title.substring(0, 50)}...`
                  : marker.title}
              </strong>
              <p>Species: {marker.species}</p>
              <p>
                Description:{" "}
                {marker.description.length > 100
                  ? `${marker.description.substring(0, 100)}...`
                  : marker.description}
              </p>
              <img src={marker.image} alt={marker.title} width="100" />
              <p>
                <small>Date: {marker.date_taken}</small>
              </p>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
