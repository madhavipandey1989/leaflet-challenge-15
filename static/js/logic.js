let data = d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(data =>{
    console.log(data)
    createFeatures(data.features);
});



var myMap;
var markers = [];
function createFeatures(earthquakeData) {

    
    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    // Run the onEachFeature function once for each piece of data in the array.
    let earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: function(feature, layer){
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
      },
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, {
            radius: feature.properties.mag * 4,
            opacity: 0.5,                            
            color:"#000",
            fillColor: markerColor(feature.geometry.coordinates[2]),
            fillOpacity: 1,
            weight: 0.5
        })
      }
    });
  
    // Send our earthquakes layer to the createMap function/
    createMap(earthquakes);
  }
  
  function createMap(earthquakes) {
  // Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

 
  // Create a baseMaps object.
  let baseMaps = {
    "Street Map": street
    ,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  let overlayMaps = {
    Earthquakes: earthquakes
  };
  

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [
      street, 
      earthquakes
    ]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, 
    overlayMaps, {
    collapsed: false
  }).addTo(myMap);


  let legend = L.control({position: 'bottomright'});

  legend.onAdd = function (myMap) {

    let div = L.DomUtil.create('div', 'info legend'),
      grades = [-10, 10, 30, 50, 70, 90],
      labels = [],
      legendInfo = "<h5>Magnitude</h5>";

      for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
          '<i style="background:' + markerColor(grades[i] + 1) + '"></i> ' +
          grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }    

    return div;

  };

  // Add legend to map
  legend.addTo(myMap);


}

// Change marker color based on depth
function markerColor(depth) {
  return depth > 90 ? '#880808' :
          depth > 70 ? '#FF5F1F' :
          depth > 50 ? '#FFA500' :
          depth > 30 ? '#FFFF00' :
          depth > 10 ? '#d9ef8b' :
                       '#39FF14';          
}

  