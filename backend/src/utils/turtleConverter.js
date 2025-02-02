function sanitizeTitle(title) {
    if (!title) return "";

    return title.replace(/[\"'\\\/<>|:*?]/g, "").trim();
}
function sanitizeText(input) {
    let sanitized = input.replace(/[\r\n\t]+/g, ' ') 
                        .replace(/\s+/g, ' ')        
                        .trim();                     

    sanitized = sanitized.replace(/[\\/<>"'`{}\[\]()*&^%$#@!+=|;:]/g, '');
    return sanitized;
}

const wikidataSpeciesMap = {
    "ducks" : "https://www.wikidata.org/wiki/Q3736439",
    "cuckoos" : "https://www.wikidata.org/wiki/Q18845",
    "sparrows" : "https://www.wikidata.org/wiki/Q115378337",
    "buntings" : "https://www.wikidata.org/wiki/Q614481",
    "storks" : "https://www.wikidata.org/wiki/Q28507",
    "orioles" : "https://www.wikidata.org/wiki/Q1300662",
    "finches" : "https://www.wikidata.org/wiki/Q160835",
    "grebes" : "https://www.wikidata.org/wiki/Q21695",
    "swifts" : "https://www.wikidata.org/wiki/Q26617",
    "swallows" : "https://www.wikidata.org/wiki/Q39861",
    "flycatchers" : "https://www.wikidata.org/wiki/Q217478",
    "pigeons" : "https://www.wikidata.org/wiki/Q10856",
    "doves" : "https://www.wikidata.org/wiki/Q113546704",
    "warblers" : "https://www.wikidata.org/wiki/Q3067559",
    "eagles" : "https://www.wikidata.org/wiki/Q2092297",
    "pelicans" : "https://www.wikidata.org/wiki/Q11846678", 
    "waterbirds" : "https://www.wikidata.org/wiki/Q3566669",
    "thrushes" : "https://www.wikidata.org/wiki/Q26050"
};


function convertToTurtle(reports) {
    let turtleData = `
        @prefix ex: <http://example.org/> .
        @prefix xsd: <http://www.w3.org/2001/XMLSchema#> . 
        @prefix wd: <https://www.wikidata.org/wiki/> .
        @prefix dbpedia: <http://dbpedia.org/resource/> .\n
    `;

    reports.forEach(report => {
        const sanitizedTitle = sanitizeTitle(report.title);
        const sanitizedDescription = sanitizeText(report.description);
        const speciesWikidata = wikidataSpeciesMap[report.speciesId.name.toLowerCase()];
        const continentDbpedia = `http://dbpedia.org/resource/${report.continent}`;
        const countryDbpedia = `http://dbpedia.org/resource/${report.country}`;

        turtleData += `
            ex:report${report._id} a ex:Report ;
                ex:title "${sanitizedTitle}" ;
                ex:date "${report.date.toISOString()}"^^xsd:dateTime ;
                ex:species ex:species${report.speciesId._id} ;
                ex:speciesName "${report.speciesId.name}";
                ex:speciesWikidata "wd:${speciesWikidata}";
                ex:description "${sanitizedDescription}" ;
                ex:imageUrl "${report.imageUrl}" ;
                ex:latitude "${report.latitude}"^^xsd:float ;
                ex:longitude "${report.longitude}"^^xsd:float ;
                ex:continent "${continentDbpedia}" ;
                ex:country "${countryDbpedia}" .\n
        `
    });
    return turtleData;
}

module.exports = { convertToTurtle };
