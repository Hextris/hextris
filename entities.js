//you can change these to sexier stuff
var colors = [
	"black",
	"orange", 
	"red",
	"blue",
];

var Clock = function(sides) {
	this.position = 0;
	this.sides = sides;
	this.blocks = [];
	for(var i=0; i<sides; i++) {
		this.blocks.push([]);
	}

	this.addBlock = function(block) {
		this.blocks[this.position].push(block);
	}

	this.rotate = function(steps) {
		this.position += steps;
		this.position = Math.abs(((this.position%sides)+this.position) % sides);
	}
}
