var vec = require('../utils/Vector.js');

var Particle = function(coords, speed){
	this.pos = coords[0];
	this.prev = coords[0];
	this.speed = speed;
	this.coords = coords
	this.index = 1;
	this.isDone = false; //if true, time to remove this particle
	this.prog = 0; //how much progress has been made from one node to the next
}

Particle.prototype.update = function(){
		this.prog+=this.speed;
		this.prev = this.pos;
		if(this.prog >= 1){
			this.index++;
			this.prog = 0;
			if (this.index >= this.coords.length){
				this.isDone = true; 
				return;
			} 
		} 	
		this.pos = vec.lerp(this.coords[this.index-1], this.coords[this.index], this.prog);
}


module.exports = Particle;