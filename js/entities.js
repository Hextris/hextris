var angularVelocityConst = 4;

function Block(lane, color, iter, distFromHex, settled) {
	this.settled = (settled === undefined) ? 0 : 1;
	this.height = 15;
	this.width = 65;
	this.lane = lane;
	this.angle = 90 - (30 + 60 * lane);
	this.angularVelocity = 0;
	this.targetAngle = this.angle;
	this.color = color;
	this.deleted = 0;
	this.removed = 0;
	this.tint = 0; //todo
	this.opacity = 0;
	this.initialization = 1;
	this.parentArr;
	this.iter = iter;

	if (distFromHex) {
		this.distFromHex = distFromHex;
	} else {
		this.distFromHex = 300;
	}

	this.incrementOpacity = function() {
		if (this.deleted) {
			var lane = MainClock.sides - this.lane;//  -this.position;
			lane += MainClock.position;

			lane = (lane+MainClock.sides) % MainClock.sides;

			this.opacity = this.opacity - 0.1;
			if (this.opacity <= 0) {
				this.opacity = 0;
				var i = 0;
				var j = this.getIndex();
				this.parentArr.splice(j,1);
				if (j < this.parentArr.length) {
					for (i = j; i < this.parentArr.length; i++) {
						this.parentArr[i].settled = 0;
					}
				}
			}
		}
		if(!this.deleted && this.opacity<1){
			this.opacity = this.opacity + 0.05;
		}
	};

	this.getIndex = function (){
		for (var i = 0; i < this.parentArr.length; i++) {
			if (this.parentArr[i] == this) {
				return i;
			}
		}
	}

	this.draw = function(attached, index) {
		// var xd = (this.settled) ? gdx : 0;
		// var yd = (this.settled) ? gdy : 0;

		this.incrementOpacity();
		if(attached == undefined)
			attached = false;

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
		this.widthWide = this.width + this.height + 3;

		var p1 = rotatePoint(-this.width / 2, this.height / 2, this.angle);
		var p2 = rotatePoint(this.width / 2, this.height / 2, this.angle);
		var p3 = rotatePoint(this.widthWide / 2, -this.height / 2, this.angle);
		var p4 = rotatePoint(-this.widthWide / 2, -this.height / 2, this.angle);

		ctx.fillStyle = this.color;
		ctx.globalAlpha = this.opacity;
		var baseX = canvas.originalWidth / 2 + Math.sin((this.angle) * (Math.PI / 180)) * (this.distFromHex + this.height / 2) + gdx;
		var baseY = canvas.originalHeight / 2 - Math.cos((this.angle) * (Math.PI / 180)) * (this.distFromHex + this.height / 2) + gdy;
		ctx.beginPath();
		ctx.moveTo(baseX + p1.x, baseY + p1.y);
		ctx.lineTo(baseX + p2.x, baseY + p2.y);
		ctx.lineTo(baseX + p3.x, baseY + p3.y);
		ctx.lineTo(baseX + p4.x, baseY + p4.y);
		ctx.lineTo(baseX + p1.x, baseY + p1.y);
		ctx.closePath();
		ctx.fill();

		if (this.tint) {
			if (this.opacity < 1) {
				this.tint = 0;
			}
			ctx.fillStyle = "#FFFFFF";
			ctx.globalAlpha = this.tint;
			ctx.beginPath();
			ctx.moveTo(baseX + p1.x, baseY + p1.y);
			ctx.lineTo(baseX + p2.x, baseY + p2.y);
			ctx.lineTo(baseX + p3.x, baseY + p3.y);
			ctx.lineTo(baseX + p4.x, baseY + p4.y);
			ctx.lineTo(baseX + p1.x, baseY + p1.y);
			ctx.closePath();
			ctx.fill();
			this.tint -= 0.02;
			if (this.tint < 0) {
				this.tint = 0;
			}
		}

		ctx.globalAlpha = 1;
	};

}

var colorSounds =  {"#e74c3c": new Audio("../sounds/lowest.ogg"),
	"#f1c40f":new Audio("../sounds/highest.ogg"),
	"#3498db":new Audio("../sounds/middle.ogg"),
	"#2ecc71":new Audio("../sounds/highest.ogg") //fix this later
};

function Clock(sideLength) {
	this.fillColor = '#2c3e50';
	this.angularVelocity = 0;
	this.position = 0;
	this.dy = 0;
	this.sides = 6;
	this.blocks = [];
	this.angle = 180 / this.sides;
	this.targetAngle = this.angle;
	this.shakes = [];
	this.sideLength = sideLength;
	this.strokeColor = 'blue';
	this.x = canvas.originalWidth / 2;
	this.y = canvas.originalHeight / 2;

	for (var i = 0; i < this.sides; i++) {
		this.blocks.push([]);
	}

	this.shake = function(obj) { //lane as in particle lane
		var angle = 30 + obj.lane * 60;
		angle *= Math.PI / 180;
		var dx = Math.cos(angle) * obj.magnitude;
		var dy = Math.sin(angle) * obj.magnitude;
		gdx -= dx;
		gdy += dy;
		obj.magnitude /= 2;
		if (obj.magnitude < 1) {
			for (var i = 0; i < this.shakes.length; i++) {
				if (this.shakes[i] == obj) {
					this.shakes.splice(i, 1);
				}
			}
		}
	};

	this.addBlock = function(block) {
		block.settled = 1;
		block.tint = 0.6;
		var lane = this.sides - block.lane;//  -this.position;
		this.shakes.push({lane:block.lane, magnitude:2});
		lane += this.position;
		lane = (lane+this.sides) % this.sides;
		block.distFromHex = MainClock.sideLength / 2 * Math.sqrt(3) + block.height * this.blocks[lane].length;
		this.blocks[lane].push(block);
		block.parentArr = this.blocks[lane];
		consolidateBlocks(this, lane, this.blocks[lane].length - 1);
	};

	this.doesBlockCollide = function(block, position, tArr) {
		if (block.settled) {
			return;
		}

		var lane = this.sides - block.lane;//  -this.position;
		lane += this.position;

		lane = (lane+this.sides) % this.sides;
		var arr = this.blocks[lane];

		if (position !== undefined) {
			arr = tArr;
			if (position <= 0) {
				if (block.distFromHex + block.iter - (this.sideLength / 2) * Math.sqrt(3) <= 0) {
					block.distFromHex = (this.sideLength / 2) * Math.sqrt(3);
					block.settled = 1;
					consolidateBlocks(this, lane, block.getIndex());
				}
			} else {
				if (block.distFromHex + block.iter - arr[position - 1].distFromHex - arr[position - 1].height <= 0) {
					block.distFromHex = arr[position - 1].distFromHex + arr[position - 1].height;
					block.settled = 1;
					consolidateBlocks(this, lane, block.getIndex());
				}
			}
		} else {
			if (arr.length > 0) {
				if (block.distFromHex + block.iter - arr[arr.length - 1].distFromHex - arr[arr.length - 1].height <= 0) {
					block.distFromHex = arr[arr.length - 1].distFromHex + arr[arr.length - 1].height;
					this.addBlock(block);
				}
			} else {
				if (block.distFromHex + block.iter - (this.sideLength / 2) * Math.sqrt(3) <= 0) {
					block.distFromHex = (this.sideLength / 2) * Math.sqrt(3);
					this.addBlock(block);
				}
			}
		}
	};

	this.rotate = function(steps) {
		if (gameState != 1) return;
		this.position += steps;
		if (!history[count]) {
			history[count] = {};
		}

		if (!history[count].rotate) {
			history[count].rotate = steps;
		}
		else {
			history[count].rotate += steps;
		}

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
		gdx = 0;
		gdy = 0;
		for (var i = 0; i < this.shakes.length; i++) {
			this.shake(this.shakes[i]);
		}
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
		ctx.shadowColor = '#2980b9';
		ctx.shadowBlur = 15;
		drawPolygon(this.x + gdx, this.y + gdy + this.dy, this.sides, this.sideLength, this.angle, this.fillColor, 0, 'rgba(0,0,0,0)');
		clearShadows();
	};
}
