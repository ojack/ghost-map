var React = require('react');

  var LeafletMap = React.createClass({
      		componentDidMount: function(){
      			var map = L.map('map',{
              attributionControl: false,
               zoomControl: false,
            }
              ).setView([this.props.lat, this.props.lon], 13);
      			console.log("mounted map");
      			L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
					   // attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
					    maxZoom: 14,
              minZoom: 12,
					    id: "oj.mecpb0ai",
					    accessToken: 'pk.eyJ1Ijoib2oiLCJhIjoiSEw0cDJaNCJ9.9ffK1AU2O26zvS5Zsa6eqw'
				}).addTo(map);

      			map.on('moveend', this.onMapMove);

      			this.map = map;
      		},
          onMapMove:function(){
              var center = this.map.getCenter();
              this.props.onMapMove(center);
          },
          getBounds: function(){
            var bounds = this.map.getBounds();
            var s = bounds._southWest.lat;
            var simpleBounds = {"s": bounds._southWest.lat, "w":bounds._southWest.lng, "n":bounds._northEast.lat, "e":bounds._northEast.lng};
            return simpleBounds;
          },
					shouldComponentUpdate: function(nextProps){
						this.map.panTo([nextProps.lat, nextProps.lon]);
						return true;
					},
      		render: function(){
      			return <div id='map' className='unit whole'/>;
      		}
      	});

module.exports = LeafletMap;