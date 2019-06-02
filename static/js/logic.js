//create map
//add layer
//api/url
//get data with D3
//loop and add marker

// Creating map object
var myMap = L.map("map", {
  center: [40.7, -73.95],
  zoom: 2 
});
 
// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Winnie Wu Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,
  //id: "mapbox.streets",
  id: "mapbox.outdoors",
  accessToken: API_KEY
}).addTo(myMap);

// Assemble API query URL
var baseURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Define a markerSize function that will give each earthquake a different radius based on its magnitude
function myMarker(mag) {
  //return mag * 40;
  return mag * 60000;
}

function getColor(d) {
  return d > 5  ? '#cc080b' :
         d > 4  ? '#f96307' :
         d > 3  ? '#fac508' :
         d > 2  ? '#f9d807' :
         d > 1  ? '#faf108' :
        '#c0f0bc' ;
  };

function addLenged(){
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'info legend'),
          magGroup= [0,1,2,3,4,5],
          labels = [];
  
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < magGroup.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(magGroup[i] + 1) + '"></i> ' +
              magGroup[i] + (magGroup[i + 1] ? '&ndash;' + magGroup[i + 1] + '<br>' : '+');
      }
      return div;
  };
  
  legend.addTo(myMap);

};

//----------------------------------------------//
// Grab the data with d3
d3.json(baseURL, function(response) {
  
// Create a new marker cluster group
  var marker = L.markerClusterGroup();

  for (var i=0; i< response.features.length; i++){

      var location = response.features[i].geometry;

      if (location) {
     
      // Loop through data
        var lat=location.coordinates[1];
        var long=location.coordinates[0];
    
      // // Add our marker cluster layer to the map  var markers = L.markerClusterGroup();
      // marker.addLayer(L.marker([lat, long]));
      var mag = response.features[i].properties.mag; 

      L.circle([lat,long], {
      fillOpacity: 0.75,
      color: getColor(mag),
      fillColor: getColor(mag),
      radius: myMarker(mag)
      
      }).bindPopup("<h3>Magnitude: " + mag + "</h3>").addTo(myMap);
 
      //}).bindPopup("<h1>" + mag + "</h1> <hr> <h3>Population: " + cities[i].population + "</h3>").addTo(myMap);
}
}
      //myMap.addLayer(marker);
}); 

addLenged();
