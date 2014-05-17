var Clock = function(sides) {
	this.sides = sides;
	this.blocks = [];
	for(var i=0; i<sides; i++) {
		this.blocks.push([]);
	}
}

var Block = function(color) {
	this.color = color;
};