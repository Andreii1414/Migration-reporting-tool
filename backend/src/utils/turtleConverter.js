function sanitizeTitle(title) {
    if (!title) return "";

    return title.replace(/[\"'\\\/<>|:*?]/g, "").trim();
}

function convertToTurtle(reports) {
    let turtleData = `
        @prefix ex: <http://example.org/> .
        @prefix xsd: <http://www.w3.org/2001/XMLSchema#> .\n
    `;

    reports.forEach(report => {
        const sanitizedTitle = sanitizeTitle(report.title);
        turtleData += `
            ex:report${report._id} a ex:Report ;
                ex:title "${sanitizedTitle}" ;
                ex:date "${report.date.toISOString()}"^^xsd:dateTime ;
                ex:species ex:species${report.speciesId._id} ;
                ex:speciesName "${report.speciesId.name}";
                ex:imageUrl "${report.imageUrl}" ;
                ex:latitude "${report.latitude}"^^xsd:float ;
                ex:longitude "${report.longitude}"^^xsd:float ;
                ex:continent "${report.continent}" ;
                ex:country "${report.country}" .\n
        `
    });
    return turtleData;
}

module.exports = { convertToTurtle };
