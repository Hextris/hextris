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
		var lane = 0;
		lane += this.position + block.lane;
		lane = lane % this.sides;
		while(lane < 0) {
			lane = lane + this.sides;
		}
		this.blocks[lane].push(block);
	}

	this.rotate = function(steps) {
		this.position += steps;
		this.position = this.position % this.sides;
		while(this.position < 0) {
			this.position = this.position + this.sides; 
		}
	}
}
