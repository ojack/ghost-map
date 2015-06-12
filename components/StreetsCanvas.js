var React = require('react');

var StreetData = require('../utils/StreetData.js');

var StreetsCanvas = React.createClass({
	componentDidMount: function(){
		//console.log(this.props);
		this.canvas = this.getDOMNode();
		this.isDrawing = false;
    	//console.log(this.props.data);
    	if(this.props.bounds){
    		var streets = new StreetData(this.props.data, this.props.bounds, this.canvas);
			this.streets = streets;
		}
		window.addEventListener( 'resize', this.onResize, false );
		window.requestAnimationFrame(this.drawStreets);
	},
	onResize: function(){
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.streets.updateDimensions(window.innerWidth, window.innerHeight);
		//console.log("window resize");
		console.log(this.canvas);
	},
	onMouseDown: function(e){
		e.preventDefault();
		this.streets.startDrawing({x: e.pageX, y: e.pageY});
		this.isDrawing = true;
	},
	onMouseMove: function(e){
		e.preventDefault();
	//	if(this.isDrawing){
			this.streets.drawNearby({x: e.pageX, y: e.pageY}, 8);
		//}
	},
	onMouseUp: function(e){
		e.preventDefault();
		this.isDrawing = false;
	},
	drawStreets: function(){
		this.streets.render();
		window.requestAnimationFrame(this.drawStreets);
	},
	componentWillReceiveProps: function(nextProps) {
    	var streets = new StreetData(nextProps.data, nextProps.bounds, this.canvas);
		this.streets = streets;
  	}, 
	render: function(){
      			return <canvas id="canvas" width={window.innerWidth} height={window.innerHeight} onMouseDown = {this.onMouseDown} onMouseMove = {this.onMouseMove} onMouseUp = {this.onMouseUp}/>;
     }
});

module.exports = StreetsCanvas;