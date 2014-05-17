//you can change these to sexier stuff
var colors = [
	"black",
	"orange", 
	"red",
	"blue",
];

var Clock = function(sides) {
	this.sides = sides;
	this.blocks = [];
	for(var i=0; i<sides; i++) {
		this.blocks.push([]);
	}
}
