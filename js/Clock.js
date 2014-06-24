function Clock(sideLength) {
	this.fillColor = [44,62,80];
        this.tempColor = [44,62,80];
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
	this.ct = 0;
	this.lastCombo = this.ct - 160;
	this.comboMultiplier = 1;
	this.texts = [];

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
		if (!(gameState == 1 || gameState == 0)) return;
		block.settled = 1;
		block.tint = 0.6;
		var lane = this.sides - block.fallingLane;// -this.position;
		this.shakes.push({lane:block.fallingLane, magnitude:4.5 * (window.devicePixelRatio ? window.devicePixelRatio : 1) * (settings.scale)});
		lane += this.position;
		lane = (lane + this.sides) % this.sides;
		block.distFromHex = MainClock.sideLength / 2 * Math.sqrt(3) + block.height * this.blocks[lane].length;
		this.blocks[lane].push(block);
		block.attachedLane = lane;
        block.checked = 1;
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
                    block.checked = 1;
				} else {
					block.settled = 0;
				}
			} else {
				if (arr[position - 1].settled && block.distFromHex - block.iter * settings.scale - arr[position - 1].distFromHex - arr[position - 1].height <= 0) {
					block.distFromHex = arr[position - 1].distFromHex + arr[position - 1].height;
					block.settled = 1;
					block.checked = 1;
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
		if (!(gameState === 1 || gameState === 0) && gameState !== -2) return;
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
        this.ct++;
		this.x = trueCanvas.width/2;

		if (gameState != -2) {
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

		drawPolygon(this.x + gdx, this.y + gdy + this.dy, this.sides, this.sideLength, this.angle, arrayToColor(this.tempColor), 0, 'rgba(0,0,0,0)');
                fadeTo(this);
	};
}
function arrayToColor(arr){
        return 'rgb(' + arr[0] + ',' + arr[1] + ',' + arr[2] + ')';
}
var subtracters=[];
function fadeTo(clock){
        var temp = clock.tempColor;
        var base = clock.fillColor;
        if(clock.ct - clock.lastCombo == 1){
                for(var i=0;i<3;i++){
                        if( base[i]>temp[i]) 
                                subtracters[i] = Math.ceil((base[i]-temp[i])/160);
                        if( base[i]<temp[i]) 
                                subtracters[i] = Math.floor((base[i]-temp[i])/160);
                }
                console.log(subtracters);

        }
        if(clock.ct - clock.lastCombo >= 160){
                subtracters=[0,0,0];
                clock.tempColor = clock.fillColor;
        }
        for(var i=0;i<3;i++){
                if(temp[i] != base[i]) {
                        clock.tempColor[i] = clock.tempColor[i]+subtracters[i];
                }
        }
}
