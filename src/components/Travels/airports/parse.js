const airportsJS = require("./airport-codes_json");

const airports = JSON.parse(airportsJS)

const airportsByLat = airports.reduce((obj, ap) => {
  if (obj[ap.lon]) console.log("double!", ap.lon, ap.name, obj[ap.lon].name);

  const { lon: lng, ...airportNoLng } = ap;
  obj[lng] = { ...airportNoLng, lng };
  return obj;
}, {});

console.log(Object.entries(airportsByLat).slice(0, 3));
