//you can change these to sexier stuff
var colors = [
"black",
"orange", 
"red",
"blue",
];

var Clock = function(sideLength) {
	this.position = 0;
	this.sides = 6;
	this.blocks = [];
	this.angle = 30;
	this.sideLength = sideLength;
	this.strokeColor = 'black';
	this.x = canvas.width / 2;
	this.y = canvas.height / 2;

	for(var i=0; i< this.sides; i++) {
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
		this.angle = 30 + this.position * 60;
	}

	this.draw = function() {
		this.drawPolygon(this.x, this.y, this.sides, this.sideLength, this.angle);
	}

	this.drawPolygon = function(x, y, sides, radius, theta) { // can make more elegant, reduce redundancy, fix readability
		ctx.beginPath();
		var coords = rotatePoint(0, radius, theta);
		ctx.moveTo(coords.x + x, coords.y + y);
		var oldX = coords.x;
		var oldY = coords.y;
		for (var i = 0; i < sides; i++) {
			coords = rotatePoint(oldX, oldY, 360 / sides); 
			ctx.lineTo(coords.x + x, coords.y + y);
			ctx.moveTo(coords.x + x, coords.y + y);
			oldX = coords.x;
			oldY = coords.y;
			// console.log(coords);
		}
		ctx.closePath();
		// ctx.fill();
		ctx.strokeStyle = this.strokeColor;
		ctx.stroke();
	}
}
