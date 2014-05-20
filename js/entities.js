// HackExeter
var angularVelocityConst = 6;

function Block(lane, color, distFromHex, settled) {
	this.settled = (settled == undefined) ? 0 : 1;
	this.height = 20;
	this.width = 65;
	this.lane = lane;
	this.angle = 90 - (30 + 60 * lane);
	this.angularVelocity = 0;
	this.targetAngle = this.angle;
	this.color = color;
	this.deleted=0;

	if (distFromHex) {
		this.distFromHex = distFromHex;
	} else {
		this.distFromHex = 300;
	}

	this.draw = function(attached, index) {
		if(attached == undefined)
			attached = false;

		// if(attached) {
		// 	this.distFromHex = 2 * MainClock.sideLength / Math.sqrt(3) + (index-1) * this.height;
		// }

		if(this.angle > this.targetAngle) {
			this.angularVelocity -= angularVelocityConst;
		}
		else if(this.angle < this.targetAngle) {
			this.angularVelocity += angularVelocityConst;
		}

		if (Math.abs(this.angle - this.targetAngle + this.angularVelocity) <= Math.abs(this.angularVelocity)) { //do better soon
			this.angle = this.targetAngle;
			this.angularVelocity = 0;
		}
		else {
			this.angle += this.angularVelocity;
		}

		this.width = 2 * this.distFromHex / Math.sqrt(3);
		this.widthswag = this.width + this.height + 3;

		var p1 = rotatePoint(-this.width / 2, this.height / 2, this.angle);
		var p2 = rotatePoint(this.width / 2, this.height / 2, this.angle);
		var p3 = rotatePoint(this.widthswag / 2, -this.height / 2, this.angle);
		var p4 = rotatePoint(-this.widthswag / 2, -this.height / 2, this.angle);

		ctx.fillStyle = this.color;
		var baseX = canvas.originalWidth / 2 + Math.sin((this.angle) * (Math.PI / 180)) * (this.distFromHex + this.height / 2);
		var baseY = canvas.originalHeight / 2 - Math.cos((this.angle) * (Math.PI / 180)) * (this.distFromHex + this.height / 2);

		ctx.beginPath();
		ctx.moveTo(baseX + p1.x, baseY + p1.y);
		ctx.lineTo(baseX + p2.x, baseY + p2.y);
		ctx.lineTo(baseX + p3.x, baseY + p3.y);
		ctx.lineTo(baseX + p4.x, baseY + p4.y);
		ctx.lineTo(baseX + p1.x, baseY + p1.y);
		ctx.closePath();
		ctx.fill();
	};

}
var colorSounds =  {"#e74c3c": new Audio("../sounds/lowest.ogg"),
	 "#f1c40f":new Audio("../sounds/highest.ogg"),
	 "#3498db":new Audio("../sounds/middle.ogg")
};

function Clock(sideLength) {
	this.fillColor = '#2c3e50';
	this.angularVelocity = 0;
	this.position = 0;
	this.sides = 6;
	this.blocks = [];
	this.angle = 180 / this.sides;
	this.targetAngle = this.angle;

	this.sideLength = sideLength;
	this.strokeColor = 'blue';
	this.x = canvas.originalWidth / 2;
	this.y = canvas.originalHeight / 2;

	for (var i = 0; i < this.sides; i++) {
		this.blocks.push([]);
	}

	this.addBlock = function(block) {
		block.settled = 1;
		var lane = this.sides - block.lane;//  -this.position;
		lane += this.position;
		while (lane < 0) {
			lane += this.sides;
		}
		lane = lane % this.sides;
		block.distFromHex = MainClock.sideLength / 2 * Math.sqrt(3) + block.height * this.blocks[lane].length;
		this.blocks[lane].push(block);
		consolidateBlocks(this, lane, this.blocks[lane].length - 1);
		if (window.chrome){
			colorSounds[block.color].load();
		}
		colorSounds[block.color].play();
	};

	this.doesBlockCollide = function(block, iter, position, tArr) {
		if (block.settled) {
			return;
		}

		var lane = this.sides - block.lane;//  -this.position;
		lane += this.position;

		while (lane < 0) {
			lane += this.sides;
		}
		lane = lane % this.sides;
		var arr = this.blocks[lane];

		if (position !== undefined) {
			arr = tArr;
			if (position <= 0) {
				if (block.distFromHex + iter - (this.sideLength / 2) * Math.sqrt(3) <= 0) {
					block.distFromHex = (this.sideLength / 2) * Math.sqrt(3);
					block.settled = 1;
				}
			} else {
				if (block.distFromHex + iter - arr[position - 1].distFromHex - arr[position - 1].height <= 0) {
					block.distFromHex = arr[position - 1].distFromHex + arr[position - 1].height;
					block.settled = 1;
				}
			}
		} else {
			if (arr.length > 0) {
				if (block.distFromHex + iter - arr[arr.length - 1].distFromHex - arr[arr.length - 1].height <= 0) {
					block.distFromHex = arr[arr.length - 1].distFromHex + arr[arr.length - 1].height;
					this.addBlock(block);
				}
			} else {
				if (block.distFromHex + iter - (this.sideLength / 2) * Math.sqrt(3) <= 0) {
					block.distFromHex = (this.sideLength / 2) * Math.sqrt(3);
					this.addBlock(block);
				}
			}
		}
	};

	this.rotate = function(steps) {
		this.position += steps;
		while (this.position < 0) {
			this.position += 6;
		}

		this.position = this.position % this.sides;
		this.blocks.forEach(function(blocks) {
			blocks.forEach(function(block) {
				block.targetAngle = block.targetAngle - steps * 60;
			});
		});

		this.targetAngle = this.targetAngle - steps * 60;
	};

	this.draw = function() {
		if (this.angle > this.targetAngle) {
			this.angularVelocity -= angularVelocityConst;
		}
		else if(this.angle < this.targetAngle) {
			this.angularVelocity += angularVelocityConst;
		}

		if (Math.abs(this.angle - this.targetAngle + this.angularVelocity) <= Math.abs(this.angularVelocity)) { //do better soon
			this.angle = this.targetAngle;
			this.angularVelocity = 0;
		}
		else {
			this.angle += this.angularVelocity;
		}

		drawPolygon(this.x, this.y, this.sides, this.sideLength, this.angle, this.fillColor);
	};
}
