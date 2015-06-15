var React = require('react');

var StreetData = require('../utils/StreetData.js');

var StreetsCanvas = React.createClass({
	componentDidMount: function(){
		//console.log(this.props);
		this.canvas = this.refs.canvas.getDOMNode();
		this.isDrawing = false;
		this.continuousDrawing = false;
    	//console.log(this.props.data);
    	console.log("called component did mount");
    	if(this.props.bounds){
    		var streets = new StreetData(this.props.data, this.props.bounds, this.canvas, this.refs.streetName.getDOMNode());
			this.streets = streets;
		}
		window.addEventListener( 'resize', this.onResize, false );
		window.requestAnimationFrame(this.drawStreets);
	},
	onResize: function(){
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.streets.updateDimensions(window.innerWidth, window.innerHeight);
	},
	onMouseDown: function(e){
		console.log(e.button);
		e.preventDefault();
		this.streets.startDrawing({x: e.pageX, y: e.pageY});
		this.isDrawing = true;
		//right or middle click starts continuous drawing mode
		if(e.button == 0){
			this.continuousDrawing = false;
		} else {
			this.continuousDrawing = true;
		}	
		
	},
	onMouseMove: function(e){
		e.preventDefault();
		if(this.isDrawing){
			this.streets.drawNearby({x: e.pageX, y: e.pageY}, 8);
		}
	},
	onMouseUp: function(e){
		e.preventDefault();
		if(!this.continuousDrawing){
			this.isDrawing = false;
		}
	},
	onTouchStart: function(e){
		e.preventDefault();
		//console.log("touch start");
		for(var i = 0; i < e.changedTouches.length; i++){
			this.streets.drawNearby({x: e.changedTouches[i].clientX, y: e.changedTouches[i].clientY}, 6);
		}
	},
	onTouchMove: function(e){
		e.preventDefault();
		//console.log("touch move");
		//console.log(e.changedTouches);
		for(var i = 0; i < e.touches.length; i++){
			//console.log("drawing "+ e.touches[i].clientX);
			this.streets.drawNearby({x: e.touches[i].clientX, y: event.touches[i].clientY}, 4);
		}
	},
	onTouchEnd: function(e){

	},
	drawStreets: function(){
		this.streets.render();
		window.requestAnimationFrame(this.drawStreets);
	},
	componentWillReceiveProps: function(nextProps) {
		console.log("called will recieve props");
		if(nextProps.redrawMap){
    		var streets = new StreetData(nextProps.data, nextProps.bounds, this.canvas, this.refs.streetName.getDOMNode());
			this.streets = streets;
		}
  	}, 
  	//how does this work? appears to not do anything
  	shouldComponentUpdate: function(nextProps, nextState){
  		console.log("saying no to update");
  		return false;
  	},
	render: function(){
			console.log("rerendering map");
      			return (<div>
      				<canvas id="canvas" ref="canvas" width={window.innerWidth} height={window.innerHeight} onContextMenu = {function (e) {e.preventDefault();}} onMouseDown = {this.onMouseDown} onMouseMove = {this.onMouseMove} onMouseUp = {this.onMouseUp} onTouchStart={this.onTouchStart} onTouchMove={this.onTouchMove} onTouchEnd={this.onTouchEnd} />;
      				<h4 id="streetName" ref="streetName"> </h4>
      			</div>
      			);
     }
});

module.exports = StreetsCanvas;