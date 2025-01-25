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
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(["All species","Deer", "Wolf", "Bear", "Eagle", "Fox", "Rabbit", "Moose"]);
      }, 500);
    });
  };

  useEffect(() => {
    const loadSpecies = async () => {
      const speciesList = await fetchSpecies();
      setAvailableSpecies(speciesList);
      setSpecies(speciesList.length ? speciesList[0] : "");
    };

    loadSpecies();
  }, []);

  const filteredSpecies = availableSpecies.filter((specie) =>
    specie.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generateDummyData = () => {
    const dummyMarkers = [
      {
        title: "Majestic " + species,
        description: "A beautiful sighting of a " + species,
        image: "https://t4.ftcdn.net/jpg/05/65/36/03/360_F_565360370_LrWWCTxczrmwqpsPYPljiFyE4gFqpecr.jpg",
        species: species,
        date_taken: new Date().toISOString().split("T")[0],
        latitude: 44.465155,
        longitude: 26.591472,
      },
      {
        title: "Wild " + species,
        description: "Spotted in the wilderness",
        image: "https://res.cloudinary.com/dmqrzhoup/image/upload/v1737567850/iortgvxtdjwqppxqt3bn.jpg",
        species: species,
        date_taken: new Date().toISOString().split("T")[0],
        latitude: 60.947513,
        longitude: 98.850633,
      },
    ];
    setMarkers(dummyMarkers);
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
            <select value={species} onChange={(e) => setSpecies(e.target.value)}>
              {filteredSpecies.map((specie) => (
                <option key={specie} value={specie}>
                  {specie}
                </option>
              ))}
            </select>
          ) : (
            <span className="error-message">No species found.</span>
          )}
        </div>

        {filteredSpecies.length > 0 && (
          <button className="update-button" onClick={generateDummyData}>
            Update Map
          </button>
        )}
      </div>

      <MapContainer center={[20, 0]} zoom={zoom} className="map-box" whenCreated={(map) => map.on("zoomend", () => setZoom(map.getZoom()))}>
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
              <strong>Title: {marker.title.length > 50 ? `${marker.title.substring(0, 50)}...` : marker.title}</strong>
              <p>Species: {marker.species}</p>
              <p>Description: {marker.description.length > 100 ? `${marker.description.substring(0, 100)}...` : marker.description}</p>
              <img src={marker.image} alt={marker.title} width="100" />
              <p><small>Date: {marker.date_taken}</small></p>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
