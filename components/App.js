var React = require('react');
var MapLocator = require('./MapLocator');
var MenuBar = require('./MenuBar');
var StreetsCanvas = require('./StreetsCanvas');
var injectTapEventPlugin = require('react-tap-event-plugin');
injectTapEventPlugin();
var json = require('../utils/start-data.json')

/* mui theme */
var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var Colors = mui.Styles.Colors;
//var StreetData = require('../utils/StreetData.js');
ThemeManager.setTheme(ThemeManager.types.DARK);

var App = React.createClass({
			  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getChildContext: function() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  },

  componentWillMount: function() {
   /* ThemeManager.setPalette({
      accent1Color: Colors.deepOrange500
    });*/
  },
			updateStreets: function(data, bounds, name){
				console.log(data[0]);
				this.setState({
					data: data,
					bounds: bounds,
					displayName: name
				});
			},
      		getInitialState: function() {

				return { 
						data: json.elements,
						bounds: {s: 40.72410403167141, w: -73.9972972869873, n: 40.73711228816394, e: -73.97583961486816},
						displayName: 'New York'
					};
				//return { view: <StreetsCanvas />};
			},
      		render: function(){
      			// <MapLocator updateStreets={this.updateStreets} />
      			return(
              <div>
              	  <MenuBar displayName={this.state.displayName} updateStreets={this.updateStreets}/>
              	  <StreetsCanvas data={this.state.data} bounds={this.state.bounds} />	
                  
              </div>
              );
      		}
      	});

module.exports = App;

