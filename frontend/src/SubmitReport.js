import React, { useState, useEffect } from "react";
import "./SubmitReport.css";
import { CLIENT_URL, SERVER_URL } from "./config";
import { getAuthHeader } from "./utils";

const SubmitReport = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [species, setSpecies] = useState("");
  const [availableSpecies, setAvailableSpecies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/api/species`, {
          headers: await getAuthHeader(),
        });
        if (!response.ok) {
          throw new Error("Failed to fetch species");
        }
        const data = await response.json();

        const speciesList = data.data.map((item) => ({
          id: item._id,
          name: item.name.replace(/\b\w/g, (char) => char.toUpperCase()),
        }));
        speciesList.sort((a, b) => a.name.localeCompare(b.name));
        return speciesList;
      } catch (error) {
        console.error("Error fetching species:", error);
        return [];
      }
    };

    fetchSpecies().then((speciesList) => {
      setAvailableSpecies(speciesList);
      setSpecies(speciesList.length ? speciesList[0].id : "");
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => console.error("Error getting location:", error)
      );
    }
  }, []);

  const filteredSpecies = availableSpecies.filter((specie) =>
    specie.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const uploadToCloudinary = async (base64Image) => {
    setIsUploading(true);
    const cloudName = "dmqrzhoup";
    const uploadPreset = "unsigned_preset";

    const data = new FormData();
    data.append("file", base64Image);
    data.append("upload_preset", uploadPreset);

    try {
      const authHeader = await getAuthHeader();

      if (!authHeader) {
        return;
      }

      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", uploadPreset);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,{
          method: "POST",
          body: data,
        });

      const result = await response.json();
      if (result.secure_url) {
        return result.secure_url;
      } else {
        throw new Error("Failed to upload image.");
      }
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      alert("Failed to upload image. Please try again.");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title || !description || !species || !location) {
      alert("Please fill in all fields and allow location access.");
      return;
    }

    let cloudinaryLink = null;

    if (image) {
      cloudinaryLink = await uploadToCloudinary(image);
      if (!cloudinaryLink) return;
    }

    const reportData = {
      title,
      description,
      date,
      speciesId: species,
      imageUrl: cloudinaryLink,
      latitude: location.latitude,
      longitude: location.longitude,
      country: "Undefined",
      continent: "Undefined",
    };

    console.log("Submitting report: ", JSON.stringify(reportData));

    try {
      const authHeader = await getAuthHeader();

      if (!authHeader) {
        return;
      }

      const response = await fetch(`${SERVER_URL}/api/reports/`, {
        method: "POST",
        body: JSON.stringify(reportData),
        headers: {
          "Content-Type": "application/json",
          ...authHeader,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to submit report.");
      }

      alert("Report submitted successfully!");
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Failed to submit report. Please try again.");
    }
  };

  return (
    <div className="report-container">
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input
          type="text"
          placeholder="Enter title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label>Description:</label>
        <textarea
          placeholder="Describe the sighting..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label>Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

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
              <option key={specie.id} value={specie.id}>
                {specie.name}
              </option>
            ))}
          </select>
        ) : (
          <span className="error-message">No species found.</span>
        )}

        <label>Upload Image:</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} />

        {image && (
          <div className="image-preview">
            <p>Image Preview:</p>
            <img src={image} alt="Uploaded Preview" />
          </div>
        )}

        {location ? (
          <p className="location-text">
            Location: {location.latitude.toFixed(5)},{" "}
            {location.longitude.toFixed(5)}
          </p>
        ) : (
          <p className="location-error">Fetching location...</p>
        )}

        {isUploading && <p className="location-error">Uploading image...</p>}
        <button type="submit">Submit Report</button>
      </form>
    </div>
  );
};

export default SubmitReport;
