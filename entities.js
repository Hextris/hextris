//you can change these to sexier stuff

function Block(lane, color, distFromHex, settled) {
	this.settled = (settled == undefined) ? 0 : 1;
	this.height = 20;
	this.width = 65;
	this.lane = lane;
	this.angle = 90 - (30 + 60 * lane);
	if (this.angle < 0) {
		this.angle += 360;
	}

	this.color = color;
	
	if (distFromHex) {
		this.distFromHex = distFromHex;
	}
	else {
		this.distFromHex = 300;
	}
	this.draw = function() {
		this.angle = 90 - (30 + 60 * this.lane);

		this.width = 2 * this.distFromHex / Math.sqrt(3);
		this.widthswag = this.width + this.height + 3;
		var p1 = rotatePoint(-this.width/2, this.height/2, this.angle);
		var p2 = rotatePoint(this.width/2, this.height/2, this.angle);
		var p3 = rotatePoint(this.widthswag/2, -this.height/2, this.angle);
		var p4 = rotatePoint(-this.widthswag/2, -this.height/2, this.angle);
		
		ctx.fillStyle=this.color;
		var baseX = canvas.width/2 + Math.sin((this.angle) * (Math.PI/180)) * (this.distFromHex + this.height/2);
		var baseY = canvas.height/2 - Math.cos((this.angle) * (Math.PI/180)) * (this.distFromHex + this.height/2);

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

var Clock = function(sideLength) {
	this.fillColor = '#2c3e50';
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
		// consolidateBlocks(this,lane,this.blocks.length-1);
	};

	this.doesBlockCollide = function(block, iter, index) {
		if (block.settled) return;
		var arr = this.blocks[(block.lane + this.position % this.sides) % this.sides];
		var thisIn = index === undefined ? arr.length - 1 : index - 1;
		if (arr.length > 0) {
			if (block.distFromHex + iter - arr[thisIn].distFromHex - arr[thisIn].height <= 0) {
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
		drawPolygon(this.x, this.y, this.sides, this.sideLength, this.angle, this.fillColor);
	};
}
