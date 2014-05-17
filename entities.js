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
	this.strokeColor = 'blue';
	this.x = canvas.width / 2;
	this.y = canvas.height / 2;

	for(var i=0; i< this.sides; i++) {
		this.blocks.push([]);
	}

	this.addBlock = function(block) {
		block.settled = 1;
		var lane = 0;
		lane += this.position + block.lane;
		lane = lane % this.sides;
		while(lane < 0) {
			lane = lane + this.sides;
		}
		block.distFromHex = MainClock.sideLength / 2 * Math.sqrt(3) + block.height * this.blocks[lane].length;
		this.blocks[lane].push(block);
	};

	this.doesBlockCollide = function(block, iter) {
		if (block.settled) return;
		var arr = this.blocks[(block.lane + this.position % this.sides) % this.sides];
		if (arr.length > 0) {
			if (block.distFromHex + iter - arr[arr.length - 1].distFromHex - arr[arr.length - 1].height <= 0) {
				this.addBlock(block);
			}
		}
		else {
			if (block.distFromHex - (this.sideLength/2) * Math.sqrt(3) <= 0) {
				this.addBlock(block);
			}

		}

	};

	this.rotate = function(steps) {
		var oldPosition = this.position;
		this.position += steps;
		this.position = this.position % this.sides;
		while(this.position < 0) {
			this.position = this.position + this.sides; 
		}
		for(var i=0; i<this.blocks.length; i++) {
			for(var j=0; j<this.blocks[i].length; j++) {
				this.blocks[i][j].lane += (this.position - oldPosition);
				this.blocks[i][j].lane = this.blocks[i][j].lane % this.sides;
				while(this.blocks[i][j].lane < 0) {
					this.blocks[i][j].lane += this.sides;
				}
			}
		}
		this.angle = 30 + this.position * 60;
	};

	this.draw = function() {
		this.drawPolygon(this.x, this.y, this.sides, this.sideLength, this.angle);
	};

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
	};
}
