//Common vector functions

exports.distance = function(start, end){
	return Math.sqrt( (end.x-start.x)*(end.x - start.x)+ (end.y-start.y)*(end.y-start.y));
}

exports.lerp = function(source, dest, amt){
	var pt = {x: source.x + amt*(dest.x - source.x), y: source.y + amt*(dest.y-source.y)};
	return pt;
}