var React = require('react');
var request = require('browser-request');

/* react material-ui*/
var mui = require('material-ui');
var TextField = mui.TextField;
var FlatButton = mui.FlatButton;
//var injectTapEventPlugin = require('react-tap-event-plugin');
//injectTapEventPlugin();

var SearchBox = React.createClass({
      		getInitialState: function() {
				return { value: '', errorText: '' };
			},
      		render: function(){
            var style = {
              fontFamily: 'Anonymous Pro, monospace'
            };
            /* <div className="unit one-quarter">
                   <FlatButton style={style} secondary={true} label="Search" onTouchTap={this.searchLocation}/>
                  </div>*/
      			return  (
                  <div className="unit whole">
          				  <TextField style={style} hintText="Search location..." errorText={this.state.errorText} id="step-map-geocode"  value={this.state.searchString} onChange={this.handleChange} onKeyUp={this.handleKeyUp}/>
                  </div>
       			)
      		},
          searchLocation: function(){

            this.getJSON(this.state.searchString, function(er, response){
                if(er){
                  console.log(er);
                } else {
                  var data = response.body;
                  console.log("response was");
                  console.log(response);
                  if(data.length > 0){
                    this.setState({location: data[0], errorText: ''});
                    this.props.setLocation(data[0]);
                  } else {
                     this.setState({errorText: "no results found"});
                  }
                }
                //this.setState({location: data})
              }.bind(this));
          },
          handleChange: function(e){
              this.setState({searchString:e.target.value});
         },
      		handleKeyUp: function(e){
            //trigger search on enter ley
      			if(e.keyCode == 13){
      				this.searchLocation();
      			}
      		},
      		//Use open street map nominatim to geolocate a point.
      		getJSON: function(query, callback){
      			var url = "http://nominatim.openstreetmap.org/?format=json&q="+query+"&format=json&limit=1";
      			request({method:'GET', url:url, json:true}, callback);
			 }
      	});

 module.exports = SearchBox;