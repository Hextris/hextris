var angularVelocityConst = 4;

function Block(fallingLane, color, iter, distFromHex, settled) {
	// whether or not a block is rested on the center clock or another block
	this.settled = (settled === undefined) ? 0 : 1;
	this.height = settings.blockHeight;
	//the lane which the block was shot from
	this.fallingLane = fallingLane;
	//the angle at which the block falls
	this.angle = 90 - (30 + 60 * fallingLane);
	//for calculating the rotation of blocks attached to the center clock
	this.angularVelocity = 0;
	this.targetAngle = this.angle;
	this.color = color;
	//blocks that are slated to be deleted after a valid score has happened
	this.deleted = 0;
	//blocks slated to be removed from falling and added to the clock
	this.removed = 0;
	//value for the opacity of the white blcok drawn over falling block to give it the glow as it attaches to the clock
	this.tint = 0;
	//value used for deletion animation
	this.opacity = 1;
	//boolean for when the block is expanding
	this.initializing = 1;
	this.ct = 0;
	//speed of block
	this.iter = iter;
	//number of iterations before starting to drop
	this.initLen = settings.creationDt;
	//side which block is attached too
	this.attachedLane;
	//distance from center clock
	this.distFromHex = distFromHex || settings.startDist * settings.scale ;

	this.incrementOpacity = function() {
		if (this.deleted) {
			//add shakes
			if (this.opacity >= .925) {
				var tLane = this.attachedLane - MainClock.position;
				tLane = MainClock.sides - tLane;
				while (tLane < 0) {
					tLane += MainClock.sides;
				}

				tLane %= MainClock.sides;
				MainClock.shakes.push({lane:tLane, magnitude:3});
			}
			//fade out the opacity
			this.opacity = this.opacity - 0.075;
			if (this.opacity <= 0) {
				//slate for final deletion
				this.opacity = 0;
				this.deleted = 2;
			}
		}
	};

	this.getIndex = function (){
		//get the index of the block in its stack
		var parrentArr = MainClock.blocks[this.attachedLane]
		for (var i = 0; i < parentArr.length; i++) {
			if (parentArr[i] == this) {
				return i;
			}
		}
	};

	this.draw = function(attached, index) {
		this.height = settings.blockHeight;
		if (Math.abs(settings.scale - settings.prevScale) > .000000001) {
			this.distFromHex *= (settings.scale/settings.prevScale);
		}

		this.incrementOpacity();
		if(attached === undefined)
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
		var p1;
		var p2;
		var p3;
		var p4;
		if (this.initializing) {
			this.ct++;
			var rat = (this.ct/this.initLen);
			p1 = rotatePoint((-this.width / 2) * rat, this.height / 2, this.angle);
			p2 = rotatePoint((this.width / 2) * rat, this.height / 2, this.angle);
			p3 = rotatePoint((this.widthWide / 2) * rat, -this.height / 2, this.angle);
			p4 = rotatePoint((-this.widthWide / 2) * rat, -this.height / 2, this.angle);
			if (this.ct == this.initLen) {
				this.initializing = 0;
			}
		} else {
			p1 = rotatePoint(-this.width / 2, this.height / 2, this.angle);
			p2 = rotatePoint(this.width / 2, this.height / 2, this.angle);
			p3 = rotatePoint(this.widthWide / 2, -this.height / 2, this.angle);
			p4 = rotatePoint(-this.widthWide / 2, -this.height / 2, this.angle);
		}

		if (this.deleted) {
			ctx.fillStyle = "#FFF";
		} else {
			ctx.fillStyle = this.color;
		}
		ctx.globalAlpha = this.opacity;
		var baseX = trueCanvas.width / 2 + Math.sin((this.angle) * (Math.PI / 180)) * (this.distFromHex + this.height / 2) + gdx;
		var baseY = trueCanvas.height / 2 - Math.cos((this.angle) * (Math.PI / 180)) * (this.distFromHex + this.height / 2) + gdy;
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
			ctx.fillStyle = "#FFF";
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

// t: current time, b: begInnIng value, c: change In value, d: duration
function easeOutCubic(t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
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
	this.x = trueCanvas.width / 2;
	this.y = trueCanvas.height / 2;

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
		if (gameState != 1) return;
		block.settled = 1;
		block.tint = 0.6;
		var lane = this.sides - block.fallingLane;//  -this.position;
		this.shakes.push({lane:block.fallingLane, magnitude:3});
		lane += this.position;
		lane = (lane+this.sides) % this.sides;
		block.distFromHex = MainClock.sideLength / 2 * Math.sqrt(3) + block.height * this.blocks[lane].length;
		this.blocks[lane].push(block);
		block.attachedLane = lane;
		block.parentArr = this.blocks[lane];
		consolidateBlocks(this, lane, this.blocks[lane].length - 1);
	};

	this.doesBlockCollide = function(block, position, tArr) {
		if (block.settled) {
			return;
		}
	
		if (position !== undefined) {
			arr = tArr;
			if (position <= 0) {
				if (block.distFromHex - block.iter * settings.scale - (this.sideLength / 2) * Math.sqrt(3) <= 0) {
					block.distFromHex = (this.sideLength / 2) * Math.sqrt(3);
					block.settled = 1;
					consolidateBlocks(this, block.attachedLane, block.getIndex());
				} else {
					block.settled = 0;
				}
			} else {
				if (arr[position - 1].settled && block.distFromHex - block.iter * settings.scale - arr[position - 1].distFromHex - arr[position - 1].height <= 0) {
					block.distFromHex = arr[position - 1].distFromHex + arr[position - 1].height;
					block.settled = 1;
					consolidateBlocks(this, block.attachedLane, block.getIndex());
				}
				else {
					block.settled = 0;
				}
			}
		} else {
			var lane = this.sides - block.fallingLane;//  -this.position;
			lane += this.position;

			lane = (lane+this.sides) % this.sides;
			var arr = this.blocks[lane];

			if (arr.length > 0) {
				if (block.distFromHex + block.iter * settings.scale - arr[arr.length - 1].distFromHex - arr[arr.length - 1].height <= 0) {
					block.distFromHex = arr[arr.length - 1].distFromHex + arr[arr.length - 1].height;
					this.addBlock(block);
				}
			} else {
				if (block.distFromHex + block.iter * settings.scale - (this.sideLength / 2) * Math.sqrt(3) <= 0) {
					block.distFromHex = (this.sideLength / 2) * Math.sqrt(3);
					this.addBlock(block);
				}
			}
		}
	};

	this.rotate = function(steps) {
		if (gameState != 1 && gameState != -2) return;
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
		this.x = trueCanvas.width/2;
		if (gameState == 1) {
			this.y = trueCanvas.height/2;
		}
		this.sideLength = settings.hexWidth;
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
		drawPolygon(this.x + gdx, this.y + gdy + this.dy, this.sides, this.sideLength, this.angle, this.fillColor, 0, 'rgba(0,0,0,0)');
	};
}
