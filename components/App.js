var React = require('react');
var MapLocator = require('./MapLocator');
var MenuBar = require('./MenuBar');
var StreetsCanvas = require('./StreetsCanvas');
var injectTapEventPlugin = require('react-tap-event-plugin');
injectTapEventPlugin();
var json = require('../utils/start-data.json')

var customTheme = require('../utils/map-theme.js')
/* mui theme */
var mui = require('material-ui');
var CircularProgress= mui.CircularProgress;
var ThemeManager = new mui.Styles.ThemeManager();
var Colors = mui.Styles.Colors;

//var StreetData = require('../utils/StreetData.js');
//ThemeManager.setTheme(ThemeManager.types.MAP);
ThemeManager.setTheme(customTheme);

var App = React.createClass({
			  childContextTypes: {
    //muiTheme: React.PropTypes.object
    muiTheme: customTheme
  },

  getChildContext: function() {
    var theme = ThemeManager.getCurrentTheme();
   theme.contentFontFamily =  "Roboto, sans-serif"
    return {
     // muiTheme: customTheme
      muiTheme: ThemeManager.getCurrentTheme()
    };
  },

  componentWillMount: function() {
   /* ThemeManager.setPalette({
      accent1Color: Colors.deepOrange500
    });*/
  },
			updateStreets: function(data, bounds, name){
				//console.log(data[0]);
        console.log("setting is loading to false");
				this.setState({
					data: data,
					bounds: bounds,
					displayName: name,
          isLoading: false,
          redrawMap: true
				});
			},

      showLoading: function(){
        // console.log("set is loading to true");
       //  this.toggleMapLocator;
         this.setState({isLoading: true, redrawMap: false}); //boolean redrawMap so that canvas does not reset streets until new data is loaded
      }, 
      		getInitialState: function() {

				return { 
						data: json.elements,
						bounds: {s: 40.72410403167141, w: -73.9972972869873, n: 40.73711228816394, e: -73.97583961486816},
						displayName: 'New York',
            isLoading: false,
            redrawMap: true
					};
				//return { view: <StreetsCanvas />};
			},
      		render: function(){
      			// <MapLocator updateStreets={this.updateStreets} />
            //<MenuBar displayName={this.state.displayName} updateStreets={this.updateStreets}/>
            // <MapLocator className="hidden" updateStreets={this.updateStreets} loadData={this.loadData}/>
           // if(this.state.showLocator)
            var loader = null; 
            if (this.state.isLoading){
             loader = <div className = "progress"> <CircularProgress mode="indeterminate" size={1} />
             </div>;
           } 
            console.log(loader);
      			return(
              <div>
              	<MenuBar displayName={this.state.displayName} updateStreets={this.updateStreets} showLoading={this.showLoading}/>
                 <StreetsCanvas redrawMap={this.state.redrawMap} data={this.state.data} bounds={this.state.bounds} />  
                {loader}
              </div>
              );
      		}
      	});

module.exports = App;

