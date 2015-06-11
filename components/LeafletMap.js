var React = require('react');

  var LeafletMap = React.createClass({
      		componentDidMount: function(){
      			var map = L.map('map').setView([this.props.lat, this.props.lon], 18);
      			console.log("mounted map");
      			L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
					    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
					    maxZoom: 18,
					    id: "oj.kkgo0nma",
					    accessToken: 'pk.eyJ1Ijoib2oiLCJhIjoiSEw0cDJaNCJ9.9ffK1AU2O26zvS5Zsa6eqw'
				}).addTo(map);

      			

      			this.map = map;
      		},
          getBounds: function(){
            var bounds = this.map.getBounds();
            var s = bounds._southWest.lat;
            var simpleBounds = {"s": bounds._southWest.lat, "w":bounds._southWest.lng, "n":bounds._northEast.lat, "e":bounds._northEast.lng};
            return simpleBounds;
          },
      		componentWillReceiveProps: function(nextProps) {
    			 this.map.panTo([nextProps.lat, nextProps.lon]);
  			}, 
      		render: function(){
      			return <div id='map' className='unit whole'/>;
      		}
      	});

module.exports = LeafletMap;