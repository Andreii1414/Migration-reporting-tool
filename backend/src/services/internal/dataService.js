const axios = require('axios');
const vision = require('@google-cloud/vision');
const Species = require('../../models/speciesModel');
const Report = require('../../models/reportModel');

const FLICKR_API_KEY = process.env.FLICKR_API_KEY;
const FLICKR_API_URL = 'https://www.flickr.com/services/rest/';

const client = new vision.ImageAnnotatorClient({
    keyFilename: './circular-truck-448121-e0-6ea1d769100a.json',
});

async function getSearchTerms() {
    const species = await Species.find();
    return species.map(s => s.name);
}

async function getMinDate() {
    const latestReport = await Report.findOne().sort({ date: -1 });
    return latestReport ? latestReport.date.toISOString().split('T')[0] : '2024-02-01';
}

function getMaxDate() {
    return new Date().toISOString().split('T')[0];
}

async function fetchPhotos(term, minDate, maxDate) {
    let allPhotos = [];
    for (let page = 1; page <= 1; page++) {
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

        const photos = response.data.photos.photo
            .filter(photo => photo.geo_is_public === 1)
            .map(photo => ({
                id: photo.id,
                title: photo.title,
                date_taken: photo.datetaken,
                latitude: photo.latitude,
                longitude: photo.longitude,
                description: photo.description || 'No description available',
                image_url: photo.url_l || photo.url_z || photo.url_m || photo.url_o || 'No image available',
                search_term: term,
            }));

        allPhotos = allPhotos.concat(photos);
    }
    return allPhotos;
}

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

const truncate = (str, maxLength) => {
    if (!str) return ''; 
    return str.length > maxLength ? str.slice(0, maxLength) : str;
  };

async function getData() {
    const searchTerms = await getSearchTerms();
    const minDate = await getMinDate();
    const maxDate = getMaxDate();
    
    let allResults = [];
    
    for (const term of searchTerms) {
        const photos = await fetchPhotos(term, minDate, maxDate);
        const filteredPhotos = await Promise.all(
            photos.map(async (photo) => {
                const isBird = await checkForBird(photo.image_url);
                return isBird ? photo : null;
            })
        );

        allResults = allResults.concat(filteredPhotos.filter(photo => photo !== null));
    }

    const species = await Species.find();
    const speciesMap = new Map();
    species.forEach(s => speciesMap.set(s.name, s._id));

    const reports = allResults.map(photo => ({
        speciesId: speciesMap.get(photo.search_term),
        date: new Date(photo.date_taken),
        latitude: photo.latitude,
        longitude: photo.longitude,
        description: truncate(photo.description?._content?.trim() || "No description provided", 500),
        title: truncate(photo.title?.trim() || "Untitled" , 100),
        imageUrl: photo.image_url,
    }));

    await Report.insertMany(reports);
    return reports;
}

module.exports = { getData };