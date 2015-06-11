//Object containing street data
//TODO: make prototype for handling vectors/individual points

var framecount = 0;
var vec = require('../utils/Vector.js');
var Particle = require('../utils/Particle.js');

var StreetData = function (data, bounds, canvas){
  console.log("init street data ");
  this.width = canvas.width;
  this.height = canvas.height;
  this.canvas = canvas;
  this.currentAnimations = [];
  //this.bounds = {ne: this.toScreenCoords([bounds.e, bounds.n]), this.toScreenCoords([bounds.w, bounds.s])};
  //way to apply function to all values in object?
 //  console.log(bounds);
  this.bounds = {n: this.toScreenY(bounds.n), w: this.toScreenX(bounds.w), s:this.toScreenY(bounds.s), e:this.toScreenX(bounds.e)}
 // console.log("bounds are ");
 // console.log(this.bounds);
  this.scale = 400; //TODO: scale relate to size of canvas
  this.nodes = {};
  this.prevmouse = {}; 
  this.particles = [];
  //console.log(canvas);
  this.context = this.canvas.getContext('2d');
  this.context.fillStyle = '#000';
  this.context.strokeStyle = '#fff';
  this.context.rect(0,0, canvas.width, canvas.height);
  this.context.fill();
  console.log(this.context);
  this.parseData(data);
  
};

 


StreetData.prototype.parseData = function(data){
  var nodes = this.nodes;
  for(var i = 0; i < data.length; i++){
   //console.log(data[i]);
   if(data[i].type =="node"){
      var d =  data[i];
     // var node = new proj4.Point(n.lon, n.lat);
   //  var p = proj4(source, dest).forward([n.lon, n.lat]);
    var scaleCoords= this.getScaleCoords(d);
    var coords = this.scaleToScreen(scaleCoords);
     var node = {
      'coords': coords,
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
        nodes[l.nodes[j]].links.push(l.nodes[j+1]);
      }
      /* add backwards connections*/
      for(var j = 1; j < l.nodes.length; j++){
        nodes[l.nodes[j]].links.push(l.nodes[j-1]);
      }      
    }

  }
 // console.log(nodes);
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
  /*console.log(this.canvas);
   this.context.fillStyle = 'rgba(255, 0, 0, 1)';
 
this.context.save();
this.context.translate(0, 50);
this.context.drawImage(this.canvas, 0, 0);
 this.context.fillRect(0, 0,20,20);
this.context.restore();*/
this.width = width;
this.height = height;
 for (id in this.nodes) {
      if (this.nodes.hasOwnProperty(id)) {
       var node = this.nodes[id];
       node.coords = this.scaleToScreen(node.scaleCoords);
      }
    }


// this.context.drawImage(this.canvas, 100, 100, width, height);
 // this.canvas.height = height;
}


StreetData.prototype.render = function(){
  framecount++;
  if(framecount%5==0){
   this.context.fillStyle = 'rgba(0,0, 0, 0.08)';
  
  this.context.fillRect(0,0, this.width, this.height);
}
 // this.context.fill();
 // console.log("new render ")
    //this.context.fillStyle = 'rgba(255, 255, 255, 0.08)';
   this.context.strokeStyle = 'rgba(255, 255, 255, 0.8)';//'#000';
 //  console.log(this.particles.length);
  for(var i = this.particles.length-1; i>=0; i--){
//   if(this.particles.length > 0){
     // var i = 0;
     this.particles[i].update();
      if(this.particles[i].isDone){
       this.particles.splice(i, 1);
    } else {
      //console.log("drawing particle" + i);
      //console.log(this.particles[i].pos.x);
      this.context.beginPath();
      this.context.moveTo(this.particles[i].prev.x, this.particles[i].prev.y);
        this.context.lineTo(this.particles[i].pos.x, this.particles[i].pos.y);
     //this.context.rect(this.particles[i].pos.x, this.particles[i].pos.y,1,1);
      //this.context.fill();
      this.context.stroke();
    /*   this.context.fillStyle = 'rgba(255, 255, 255, 0.08)';
      this.context.fillRect(this.particles[i].pos.x, this.particles[i].pos.y,2,2);*/
    }
    }
     this.context.strokeStyle = 'rgba(0, 80, 80, 0.08)';
    for(var i = this.particles.length-2; i>=0; i--){
//   if(this.particles.length > 0){
     // var i = 0;
    
      //console.log("drawing particle" + i);
      //console.log(this.particles[i].pos.x);
      this.context.beginPath();
      this.context.moveTo(this.particles[i].pos.x, this.particles[i].pos.y);
        this.context.lineTo(this.particles[i+1].pos.x, this.particles[i+1].pos.y);
     //this.context.rect(this.particles[i].pos.x, this.particles[i].pos.y,1,1);
      //this.context.fill();
      this.context.stroke();
    /*   this.context.fillStyle = 'rgba(255, 255, 255, 0.08)';
      this.context.fillRect(this.particles[i].pos.x, this.particles[i].pos.y,2,2);*/
   
    }
   // console.log(this.particles.length);
   // }
}

StreetData.prototype.startDrawing = function(point){
  this.prevmouse = point;
  this.drawNearby(point, 30);
}
  
StreetData.prototype.drawPoint = function(point, rad){
  this.context.fillStyle = 'rgba(255, 255, 255, 0.08)';
  this.context.fillRect(point.x, point.y,2,2);
    //this.context.fill();
}

StreetData.prototype.drawNearby = function(point, rad){
    var d = vec.distance(point, this.prevmouse);
   // var jit = 0.5 + d/100; // scale jitter based on speed mouse is moving
   var jit = 2;
   //var speed = 0.1 + d*0.003/;
   var speed = 0.15 + d*0.002;
    var nodes = this.nodes;
   // console.log(speed);
   // 
   // console.log("drawing nearby");
    for (id in nodes) {
      if (nodes.hasOwnProperty(id)) {

        if(vec.distance(point, nodes[id].coords) < rad) {
            var node = nodes[id];
            for(var i = 0; i < 1; i++){
             var arr = [];
             arr.push(node.coords);
             if(Math.random() > 0){
              var path = this.getRandomPath(node.links, arr, 1+Math.floor(Math.random()*60), jit);
             //  console.log(path);
              var p = new Particle(path, speed); 
             // var p = new Particle({x: 100, y: 80}, {x: 500, y: 100}, 10);
             // console.log(p);
              this.particles.push(p);
            }
           }
           
          }
        }

      }
}

/* given a node, choose a random connected node*/

StreetData.prototype.getRandomPath = function(links, nodes, steps, jitter){
    if(steps==0) return nodes;
    var rand = this.nodes[links[Math.floor(Math.random()*links.length)]];
    var randCoords = {x: rand.coords.x+jitter*2*Math.random()-jitter, y: rand.coords.y+jitter*2*Math.random()-jitter}
    nodes.push(randCoords);
   // console.log(nodes);
    return this.getRandomPath(rand.links, nodes, steps-1, jitter);
}
/*
StreetData.prototype.drawRecursive = function(node, steps){
  console.log("steps is "+ steps);
  if(steps <= 0) {
    return null;
  } else {
  for(var i = 0; i < node.links.length; i++){
      var next = this.nodes[node.links[i]];
     // this.drawPath(node.x, node.y, next.x, next.y);
   //  this.animatePath(node.x, node.y, next.x, next.y, 0, 0.5);
     // this.drawRecursive(next, steps-1);
   }
  }
}

StreetData.prototype.animatePath = function(x1, y1, x2, y2, start, rate){
  var x = vec.lerp(x1, x2, rate);
  var y = vec.lerp(y1, y2, rate);
  var x_inc = vec.lerp(x1, x2, rate*2);
  var y_inc = vec.lerp(y1, y2, rate*2);
  this.drawPath(x, y, x_inc, y_inc);
  requestAnimationFrame
}*/

StreetData.prototype.drawPath = function(src, dest){
  this.context.beginPath();
  this.context.moveTo(src.x, src.y);
  this.context.lineTo(dest.x, dest.y);
  this.context.stroke();
}

StreetData.prototype.drawBranch = function(node){
    for(var i = 0; i < node.links.length; i++){
      var next = this.nodes[node.links[i]];
      this.drawPath(node.coords, next.coords);
    }
}


// to do -- name lookup table storing the name of each link by id

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


//function long2tile(lon,zoom) { return (Math.floor((lon+180)/360*Math.pow(2,zoom))); }

module.exports = StreetData;
