var React = require('react');
var SearchBox = require('./SearchBox');
var LeafletMap = require('./LeafletMap');
var OSMquery = require('../utils/OSMquery.js');

var mui = require('material-ui');
var RaisedButton = mui.RaisedButton;


var MapLocator = React.createClass({
           
    getInitialState: function() {
      	return { location: {
      		display_name: "New York",
      		lat: "40.7305991",
      		lon: "-73.9865812" }
      	};
	},
	setLocation: function(data){
            console.log(data);
            this.setState({location: data, display_name: data.display_name}); // store only bounds in state, not entire object
		//console.log(this.state);
	},
	//TODO: show data loading + error response
	getOSMdata: function(){
		console.log("button clicked");
		var bounds = this.refs.map.getBounds();
		this.props.loadData();
		OSMquery.getWays(bounds, function(err, data){
			if(err){
				console.log(err);
			} else {
				console.log(this.props);
				this.props.updateStreets(data, bounds, this.state.display_name); //TODO: change this!
				//var streets = new StreetData(data, bounds);
			}
		}.bind(this));
	},
	render: function(){
		return (
			<div>
					<div className = "grid">
						 <SearchBox setLocation={this.setLocation}/>
					</div>
                        <div className="grid">
                              <LeafletMap ref="map" lat={this.state.location.lat} lon={this.state.location.lon}/>
                        </div>

                  <div className="grid">
                  			 <RaisedButton label="Cancel" primary={true} onTouchTap={this.props.handleCancel} />
                              <RaisedButton label="Load" primary={true} onTouchTap={this.getOSMdata} />
				</div>
             </div>
  );
	}
});

module.exports = MapLocator;