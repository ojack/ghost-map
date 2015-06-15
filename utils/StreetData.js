//Object containing street data
//TODO: make prototype for handling vectors/individual points

var framecount = 0;
var vec = require('../utils/Vector.js');
var Particle = require('../utils/Particle.js');

var StreetData = function (data, bounds, canvas, streetName){
  console.log("init street data ");
  this.width = canvas.width;
  this.height = canvas.height;
  this.canvas = canvas;
  streetName.innerHTML = '';
  this.name = streetName;
  this.currentAnimations = [];
  this.bounds = {n: this.toScreenY(bounds.n), w: this.toScreenX(bounds.w), s:this.toScreenY(bounds.s), e:this.toScreenX(bounds.e)}
  this.nodes = {};
  this.particles = [];
  this.context = this.canvas.getContext('2d');
  this.context.fillStyle = '#000';
  this.context.strokeStyle = '#fff';
  this.parseData(data);
};

 


StreetData.prototype.parseData = function(data){
  var nodes = this.nodes;
  for(var i = 0; i < data.length; i++){
   if(data[i].type =="node"){
      var d =  data[i];
    var scaleCoords= this.getScaleCoords(d);
    var coords = this.scaleToScreen(scaleCoords);
     var node = {
      'coords': coords,
      'names': '',
      'scaleCoords': scaleCoords,
      'geoCoords':d,
      'links': []
     }
     nodes[d.id] = node;
    }
  }
    /* Each node (point or intersection) stores an object for each other node that it is connected to
    in the array "links"*/
   for(var i = 0; i < data.length; i++){
   
    if(data[i].type=="way"){ 
      var l = data[i];    
      /* add forward connections*/

      for(var j = 0; j < l.nodes.length-1; j++){
        nodes[l.nodes[j]].links.push(nodes[l.nodes[j+1]]);
        if(l.tags.name) nodes[l.nodes[j]].name = l.tags.name;
      }
      /* add backwards connections*/
      for(var j = 1; j < l.nodes.length; j++){
        nodes[l.nodes[j]].links.push(nodes[l.nodes[j-1]]);
      }      
    }

  }
  this.nodes = nodes;
  this.drawAll();
};

StreetData.prototype.drawAll = function(){
  var nodes = this.nodes;
  for (var node in nodes) {
    if (nodes.hasOwnProperty(node)) {
      this.drawBranch(nodes[node]);
        // do stuff
    }
  }
}

StreetData.prototype.updateDimensions = function(width, height){
this.width = width;
this.height = height;
 for (id in this.nodes) {
      if (this.nodes.hasOwnProperty(id)) {
       var node = this.nodes[id];
       node.coords = this.scaleToScreen(node.scaleCoords);
      }
    }
}


StreetData.prototype.render = function(){
  framecount++;
  if(framecount%5==0){
   this.context.fillStyle = 'rgba(0,0, 0, 0.08)';
  
  this.context.fillRect(0,0, this.width, this.height);
}
 var hue = this.particles.length+180;
 this.context.strokeStyle = 'hsla('+hue*2+', 100%, 20%, 0.05)';
  for(var i = this.particles.length-1; i>=0; i--){
     this.particles[i].update();
      if(this.particles[i].isDone){
       this.particles.splice(i, 1);
    } else {
     if(i>0){
        this.context.beginPath();
      this.context.moveTo(this.particles[i].pos.x, this.particles[i].pos.y);
        this.context.lineTo(this.particles[i-1].pos.x, this.particles[i-1].pos.y);
      this.context.stroke();
    }
    }
    }
      this.context.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    for(var i = this.particles.length-1; i>=0; i--){
        this.context.beginPath();
      this.context.moveTo(this.particles[i].prev.x, this.particles[i].prev.y);
        this.context.lineTo(this.particles[i].pos.x, this.particles[i].pos.y);
      this.context.stroke();
    
    }
}

StreetData.prototype.startDrawing = function(point){
  this.drawNearby(point, 30);
}
  


StreetData.prototype.drawNearby = function(point, rad){
   var jit = 2;
   var speed = 0.15 + d*0.002;
    var nodes = this.nodes;
    for (id in nodes) {
      if (nodes.hasOwnProperty(id)) {

        if(vec.distance(point, nodes[id].coords) < rad) {
            var node = nodes[id];
            if(node.name!=undefined) this.name.innerHTML = node.name;
           // console.log(node.name);
            for(var i = 0; i < 1; i++){
             var arr = [];
             arr.push(node.coords);
             if(Math.random() > 0){
              var path = this.getRandomPath(node.links, arr, 1+Math.floor(Math.random()*60), jit);
              var p = new Particle(path, speed); 
              this.particles.push(p);
            }
           }
           
          }
        }

      }
}

/* recurse function that accepts a starting node,  and number of segments, and returns a path of the given segment length starting 
from that node*/
StreetData.prototype.getRandomPath = function(links, coords, steps, jitter){
    if(steps==0) return coords;
    //choose one of the connected nodes at random
    var randNode = links[Math.floor(Math.random()*links.length)];
    //deviate slightly from actual path to create sketchy effect
    var randCoords = {x: randNode.coords.x+jitter*2*Math.random()-jitter, y: randNode.coords.y+jitter*2*Math.random()-jitter};
    coords.push(randCoords);
    return this.getRandomPath(randNode.links, coords, steps-1, jitter);
}

//draw an individual path
StreetData.prototype.drawPath = function(src, dest){
  this.context.beginPath();
  this.context.moveTo(src.x, src.y);
  this.context.lineTo(dest.x, dest.y);
  this.context.stroke();
}

//Draw a node and all nodes connected to it
StreetData.prototype.drawBranch = function(node){
    for(var i = 0; i < node.links.length; i++){
      var next = node.links[i];
      this.drawPath(node.coords, next.coords);
    }
}


//utility functions for scaling data based on Latitude longitude bounds and screen dimensions

StreetData.prototype.scaleToScreen = function(n){
  return {'x': n.scaleX*this.width, 'y': n.scaleY*this.height};
}

StreetData.prototype.getScaleCoords = function(n){
  var x = this.toScreenX(n.lon);
  var y = this.toScreenY(n.lat);
  var scaleX = (x - this.bounds.w)/(this.bounds.e - this.bounds.w);
  var scaleY = (y-this.bounds.n)/(this.bounds.s-this.bounds.n);
  return {'scaleX': scaleX, 'scaleY': scaleY};
}

StreetData.prototype.toScreenX = function(x){
  var ret =  (x + 180)*(this.width / 360)
  return ret;
}

StreetData.prototype.toScreenY = function(y){
  return  (y*(-1)+90) * (this.height/180)
}

module.exports = StreetData;
