# Migration-reporting-tool



<!-- Table of Contents -->
# Table of Contents

- [About the Project](#about-the-project)
  * [Screenshots](#screenshots)
  * [Tech Stack](#tech-stack)
  * [Features](#features)
  * [Color Reference](#-color-reference)
  * [Environment Variables](#environment-variables)
- [Deliverables](#deliverables)
  * [Team contributions](#team-contributions)
  * [Project progress](#project-progress)
- [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
- [Usage](#usage)
- [Acknowledgements](#acknowledgements)

  
The application can be found at: https://migration-reporting-tool-frontend.onrender.com/ It may take about a minute to start, as we are using a free service, and the application may become inactive. After that, it will work properly.

<!-- About the Project -->
## About the Project
Considering observations provided by users (e.g., messages posted on a social network) or various sensors, develop an "intelligent" Web system capable to generate in real-time an interactive map regarding the migrations performed by various entities (birds, humans, robots, extraterrestrial beings) in a specific context (season, working, politic factors, calamity). A migration-related event could be directly reported – in conjunction to the GPS info + optional (meta)data – into the implemented platform or by using #mig-here hashtag on an existing social Web application (Instagram, Twitter, Vimeo). Several useful statistics and visualizations about the migratory habits of specific species – including information on geographical areas, climate, seasons, user comments/images/videos, etc. – should be offered by a SPARQL endpoint – possibly enhanced by additional knowledge from DBpedia and/or Wikidata. Visit also Migration Data Portal. Bonus: adopting a stream processing approach.


<!-- Screenshots -->
### Screenshots

<div align="center"> 
  <img src="https://i.imgur.com/QpixIb4.png" alt="screenshot" />
  <img src="https://i.imgur.com/rxJUN4r.png" alt="screenshot" />
</div>


<!-- TechStack -->
### Tech Stack

<details>
  <summary>Backend</summary>
  The backend of this project is developed using Node.js with Express.js, providing a RESTful API to handle migration-related events, process user reports, and serve data to the frontend.
 <h6>Project structure</h6>
 <ul>
 <li>controllers/ – Implements business logic, processing API requests and responses</li>
 <li>middlewares/ – Custom middleware functions responsible for: authentication, MongoDB ID Validation </li>
  <li>models/ – Defines MongoDB schemas for: users, reports, bird species</li>
  <li>request-validators/ – Ensures that data written to the database meets predefined conditions, preventing invalid entries.</li>
  <li>responses/ – Contains constants and standardized response messages used throughout the API for different scenarios (e.g., success, errors, validation failures)</li>
  <li>routes/ – Defines API endpoints and maps them to corresponding controllers</li>
  <li>services/ – Implements business logic and external integrations, such as processing migration reports, interacting with third-party APIs, or managing background tasks.</li>
  <li>utils/ – Utility functions for reusable logic, such as date formatting, logging, and data transformations.</li>

 </ul>
</details>

<details>
  <summary>Frontend</summary>
  The frontend is built with React.js, providing a user-friendly interface for interacting with migration data. It allows users to view migration maps, submit reports, and access statistical insights.
  <h6>Project files</h6>
  <ul>
    <li>MapView.js – Displays an interactive map with migration data.</li>
    <li>StatisticsView.js – Shows analytical insights and statistics, allowing users to query the SPARQL endpoint to create custom statistics</li>
    <li>SubmitReport.js – Allows users to report migration events.</li>
    <li>Authentication pages – Login, register, and password reset functionality</li>
  </ul>
</details>

<details>
<summary>Database</summary>
The database is built using MongoDB, a NoSQL document-based database, to efficiently store and manage data related to users, migration reports, and species. 
<h6>Collections and Schema</h6>
  <ul>
    <li>Users Collection (users) – Stores user authentication and profile details: name, email, passwordHash, verified, etc</li>
    <li>Reports Collection (reports) – Stores migration event reports: title, description, date, speciesId, imageUrl, latitude, longitude, continent, country</li>
    <li>Species Collection (species) – Stores information about bird species involved in migrations: id, name</li>
  </ul>
</details>

<details>
<summary>Knowledge Graph & SPARQL Integration</summary>
The system integrates a knowledge graph stored in GraphDB (Ontotext) Cloud, enabling semantic data representation and advanced querying. Migration-related data is structured using RDF (Resource Description Framework)
  <h6>SPARQL Queries</h6>
  <ul>
    <li>Predefined Queries – The system provides built-in SPARQL queries to generate statistics on migration patterns</li>
    <li>Custom Queries – Users can create custom SPARQL queries via the public SPARQL endpoint, allowing them to extract specific insights based on their own criteria</li>
  </ul>
</details>

<!-- Features -->
### Features

- Migration Tracking - Users can report migrations via the form on the page. Previously, the data is extracted using the Flickr API and filtered to have a larger data set
- Interactive Map – Visualizes migration data from both user reports and external sources
- Advanced Statistics – Predefined and custom SPARQL queries for migration trends and species insights
- Knowledge Graph Integration – Data stored in GraphDB (Ontotext) Cloud
- User Authentication – Secure login, registration, and password reset with email verification

<!-- Color Reference -->
### Color Reference

| Color             | Hex                                                                |
| ----------------- | ------------------------------------------------------------------ |
| Primary Color | ![#4E3636](https://via.placeholder.com/10/4E3636?text=+) #222831 |
| Secondary Color | ![#321E1E](https://via.placeholder.com/10/321E1E?text=+) #321E1E |
| Button Color | ![#CD1818](https://via.placeholder.com/10/CD1818?text=+) #CD1818 |
| Text Color | ![#EEEEEE](https://via.placeholder.com/10/EEEEEE?text=+) #EEEEEE |

<!-- Env Variables -->
### Environment Variables

This project requires certain environment variables and configuration settings to run correctly. These settings can be found at <a href="">this link</a>.


## Deliverables
1. Public Wiki: https://github.com/Andreii1414/Migration-reporting-tool/wiki
2. Falsehood, UI Faces, C4 Model, Design Docs: https://docs.google.com/document/d/1Bl7rBoMQgfKZMvLB0fGxFYaK7EEDNZuoTHBYo6DZlEk/edit?usp=sharing
3. API Specification (OpenAPI/GraphQL): https://app.swaggerhub.com/apis/mirt/Migration-Reporting-Tool/1.0.0
4. Technical Report (Scholarly HTML): https://github.com/Andreii1414/Migration-reporting-tool/blob/main/tehnical%20report/tehnical-report.html
    - Internal data structures and models used in the application
    - Technical details of the API (REST/GraphQL) and its architecture
    - RDF-based knowledge models, ontologies, taxonomies, or vocabularies used
    - Integration of external knowledge bases (Wikidata, DBpedia, etc.), including non-trivial SPARQL queries
    - User Guide: https://www.youtube.com/watch?v=POh1sB7q3CQ
5. Fully Deployed Solution: https://migration-reporting-tool-frontend.onrender.com/

### Team Contributions

<ul>
<li>Andrei Apricopoai: Implemented authentication features (login, register, Google login, password reset), set up the project and created the reporting form.</li>
<li>Andrei Socoteala: Developed data extraction from Flickr, migrated data to GraphDB, created queries for predefined statistics, and built the endpoint route for custom SPARQL statistics.</li>
<li>Both: Created the interactive map displaying bird sightings.</li>
</ul>

### Project Progress

<ul>
<li>Progress 1: Andrei Apricopoai set up the project using Node.js, React, and MongoDB</li>
<li>Progress 2: Andrei Socoteala created the system that extracts data from Flickr using the Flickr API, Google Vision API, and Big Data Cloud API.</li>
<li>Progress 3: Andrei Apricopoai created the report form system, including the frontend interface for user submissions.</li>
<li>Progress 4: Andrei Socoteala built the system that migrates extracted data to GraphDB and generates predefined statistical queries.</li>
<li>Progress 5: Andrei Socoteala developed the SPARQL endpoint system for handling custom statistics queries.</li>
<li>Progress 6: Both created the interactive map system, including frontend and backend integration for visualizing bird sightings.</li>
<li>Progress 7: Andrei Apricopoai built the authentication system, including frontend and backend for login, register, Google login, password reset, and user session management.</li>
</ul>

<!-- Getting Started -->
## Getting Started

<!-- Prerequisites -->
### Prerequisites

Make sure you have the following installed before proceeding:
<ul>
<li>Node.js (download from <a href="https://nodejs.org/en">Node.js</a>)</li>
<li>npm (comes bundled with Node.js)
</li>
</ul>

<!-- Installation -->
### Installation

After verifying the prerequisites, follow these steps to install the backend and frontend.

<h6>1. Clone the repository</h6>

```bash
git clone https://github.com/Andreii1414/Migration-reporting-tool
```

<h6>2. Navigate to the backend directory:</h6>

```bash
cd backend
```

<h6>3. Create a .env file and add the required environment variables, also add the previously downloaded json.</h6>

<h6>4. Install backend dependencies:</h6>

```bash
npm install
```

<h6>5. Start the server</h6>

```bash
npm run dev
```

<h6>6. Navigate to the frontend directory:</h6>

```bash
cd frontend
```

<h6>7. If you encounter dependency issues, run:</h6>

```bash
npm config set legacy-peer-deps true
```
  
<h6>8. Install frontend dependencies:</h6>

```bash
npm install
```

<h6>9. Start the React application:</h6>

```bash
npm start
```

<!-- Usage -->
## Usage

This project is designed to collect, process, and visualize bird sighting data through multiple APIs and a structured database system.

<h6>Data flow</h6>
<ul>
<li>Data Collection:
Bird sighting images are retrieved using the Flickr API.
</li>

```javascript
const response = await axios.get(FLICKR_API_URL, {
            headers: {
                'User-Agent': 'MigrationReportingTool/1.0',
            },
            params: {
                method: 'flickr.photos.search',
                api_key: FLICKR_API_KEY,
                text: term,
                min_taken_date: minDate,
                max_taken_date: maxDate,
                extras: 'description,geo,url_o,geo_is_public,date_taken,url_l,url_m,url_z',
                format: 'json',
                nojsoncallback: 1,
                per_page: 500,
                page: page,
                sort: 'interestingness-desc',
            },
        });
```

<li>Image Processing:
Images are analyzed using the Google Vision API to verify that they contain birds.</li>

```javascript
async function checkForBird(imageUri) {
    try {
        const [result] = await client.labelDetection(imageUri);
        const labels = result.labelAnnotations;
        return labels.some(label => label.description.toLowerCase() === 'bird');
    } catch (error) {
        console.error('Error using Vision API:', error.message);
        return false;
    }
}
```

<li>Geolocation:
Extracted latitude and longitude coordinates are processed through a geolocation API to determine the country and continent of the sighting</li>

```javascript
sync function getLocationData(lat, lon) {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode?latitude=${lat}&longitude=${lon}&localityLanguage=en&key=${process.env.BIGDATACLOUD_API_KEY}`;
    try {
        const response = await axios.get(url);
        const data = response.data;

        if (data) {
            return {
                country: data.countryName || "Unknown",
                continent: data.continent || "Unknown",
            };
        }
    } catch (error) {
        console.error("Error fetching geolocation data:", error.message);
    }
    return { country: "Unknown", continent: "Unknown" };
}
```

<li>Database Storage:
The processed data is stored in MongoDB.</li>
<li>Data Transformation:
Data is converted into Turtle format using a custom converter</li>

```javascript
function convertToTurtle(reports) {
    let turtleData = `
        @prefix ex: <http://example.org/> .
        @prefix xsd: <http://www.w3.org/2001/XMLSchema#> .\n
    `;

    reports.forEach(report => {
        const sanitizedTitle = sanitizeTitle(report.title);
        const sanitizedDescription = sanitizeText(report.description);
        turtleData += `
            ex:report${report._id} a ex:Report ;
                ex:title "${sanitizedTitle}" ;
                ex:date "${report.date.toISOString()}"^^xsd:dateTime ;
                ex:species ex:species${report.speciesId._id} ;
                ex:speciesName "${report.speciesId.name}";
                ex:description "${sanitizedDescription}" ;
                ex:imageUrl "${report.imageUrl}" ;
                ex:latitude "${report.latitude}"^^xsd:float ;
                ex:longitude "${report.longitude}"^^xsd:float ;
                ex:continent "${report.continent}" ;
                ex:country "${report.country}" .\n
        `
    });
    return turtleData;
}
```

<li>Graph Database:
The transformed data is written into GraphDB Ontotext Cloud</li>
</ul>

<h6>Frontend features</h6>
<ul>
<li>Main Map:
Users can filter data by season and bird species to visualize sightings on a map.</li>
<li>Statistics Page:
Retrieves data from the SPARQL endpoint in GraphDB to generate statistics.
Provides an interface for users to perform custom SPARQL queries.</li>
<li>Submit Report Page:
Users can submit their own bird sighting reports.
An API(Cloudinary) generates image links for storage and reference.</li>
</ul>



<!-- Acknowledgments -->
## Acknowledgements

This project utilizes several valuable resources and tools:

 - [Flickr API](https://www.flickr.com/services/api/)
 - [Google Vision API](https://cloud.google.com/vision?hl=ro)
 - [MongoDB](https://www.mongodb.com/)
 - [GraphDB Ontotext](https://www.ontotext.com/products/graphdb/)
 - [SparQL](https://www.w3.org/TR/sparql11-query/)


**Tags:** project, infoiasi, wade, web
