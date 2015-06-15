var React = require('react');
var SearchBox = require('./SearchBox');
var LeafletMap = require('./LeafletMap');
var OSMquery = require('../utils/OSMquery.js');

var mui = require('material-ui');
var FlatButton = mui.FlatButton;


var MapLocator = React.createClass({
           
    getInitialState: function() {
      	return { location: {
      		display_name: "New York",
      		lat: "40.7305991",
      		lon: "-73.9865812",
      		 },
      		 showLoadButton: false
      	};
	},
	setLocation: function(data){
            console.log("setting location");
            this.setState({location: data, display_name: data.display_name}); // store only bounds in state, not entire object
		//console.log(this.state);
	},
	onMapMove:function(center){
		this.setState({location: {lat: center.lat, lon: center.lng}, showLoadButton: true});
	},
	//TODO: show data loading + error response
	getOSMdata: function(){
		console.log("button clicked");
		var bounds = this.refs.map.getBounds();
		this.props.loadData();
		 this.setState({showLoadButton: false});
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
		 var style = {
              fontFamily: 'Anonymous Pro, monospace'
            };
            //hack to offset location because react-material ui expects a title in modal dialog
           var offsetStyle = {
           	marginTop: '-48px'
           };

         console.log(this.state);
         var loadButton = null;
         if(this.state.showLoadButton == true){
         	loadButton = (  <div className="grid align-cneter">
                  		<div className="unit whole align-center" >
                             <FlatButton style={style} label="Load" primary={true} onTouchTap={this.getOSMdata} />
						</div>
				</div>);
         }
           //<FlatButton className="unit half" style={style} label="Cancel" secondary={true} onTouchTap={this.props.handleCancel} />
		return (
			<div style={offsetStyle}>
					<div className = "grid align-center">
						 <SearchBox setLocation={this.setLocation}/>
					</div>
                        <div className="grid align-center">
                              <LeafletMap ref="map" lat={this.state.location.lat} lon={this.state.location.lon} onMapMove={this.onMapMove}/>
                        </div>

                	{loadButton}
             </div>
  );
	}
});

module.exports = MapLocator;