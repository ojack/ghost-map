var request = require('browser-request');


/* receives nodes within boundaries, and  as Lat-Ln coordinates as leaflet LatLn bounds*/
exports.getWays = function (bounds, callback) {
  var overpassUrl = 'https://overpass-api.de/api/interpreter';
  console.log(bounds);
  var query = overpassUrl+ "?data=[out:json];(way[\"highway\"]("+bounds.s+","+bounds.w+","+bounds.n+","+bounds.e+");node(w););out;";
    console.log(query);
    //TODO: error handling for bad requests
    request({method:'GET', url:query, json:true}, function(er, data){
      if(er){
        callback(er, null);
      } else { 
        //console.log(data.response);
        callback(null, JSON.parse(data.response).elements);
       // this.parseData(features.elements);
      }
    });
};

