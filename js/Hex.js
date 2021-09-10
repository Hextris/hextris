function Hex(sideLength) {
	this.playThrough = 0;
	this.fillColor = [37,45,56];
	this.tempColor = [37,45,56];
	this.angularVelocity = 0;
	this.position = 0;
	this.dy = 0;
	this.dt = 1;
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
	this.lastCombo = this.ct - settings.comboTime;
	this.lastColorScored = "#000";
	this.comboTime = 1;
	this.texts = [];
  this.lastRotate = Date.now();
  this.comboMultiplier = 1;
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
		obj.magnitude /= 2 * this.dt;
		if (obj.magnitude < 1) {
			for (var i = 0; i < this.shakes.length; i++) {
				if (this.shakes[i] == obj) {
					this.shakes.splice(i, 1);
				}
			}
		}
	};

	this.addBlock = function(block) {
		if (!(gameState == 1 || gameState === 0)) return;
		block.settled = 1;
		block.tint = 0.6;
		var lane = this.sides - block.fallingLane;// -this.position;
		this.shakes.push({lane:block.fallingLane, magnitude:4.5 * (window.devicePixelRatio ? window.devicePixelRatio : 1) * (settings.scale)});
		lane += this.position;
		lane = (lane + this.sides) % this.sides;
		block.distFromHex = MainHex.sideLength / 2 * Math.sqrt(3) + block.height * this.blocks[lane].length;
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
				if (block.distFromHex - block.iter * this.dt * settings.scale - (this.sideLength / 2) * Math.sqrt(3) <= 0) {
					block.distFromHex = (this.sideLength / 2) * Math.sqrt(3);
					block.settled = 1;
					block.checked = 1;
				} else {
					block.settled = 0;
					block.iter = 1.5 + (waveone.difficulty/15) * 3;
				}
			} else {
				if (arr[position - 1].settled && block.distFromHex - block.iter * this.dt * settings.scale - arr[position - 1].distFromHex - arr[position - 1].height <= 0) {
					block.distFromHex = arr[position - 1].distFromHex + arr[position - 1].height;
					block.settled = 1;
					block.checked = 1;
				}
				else {
					block.settled = 0;
					block.iter = 1.5 + (waveone.difficulty/15) * 3;
				}
			}
		} else {
			var lane = this.sides - block.fallingLane;//  -this.position;
			lane += this.position;

			lane = (lane+this.sides) % this.sides;
			var arr = this.blocks[lane];

			if (arr.length > 0) {
				if (block.distFromHex + block.iter * this.dt * settings.scale - arr[arr.length - 1].distFromHex - arr[arr.length - 1].height <= 0) {
					block.distFromHex = arr[arr.length - 1].distFromHex + arr[arr.length - 1].height;
					this.addBlock(block);
				}
			} else {
				if (block.distFromHex + block.iter * this.dt * settings.scale - (this.sideLength / 2) * Math.sqrt(3) <= 0) {
					block.distFromHex = (this.sideLength / 2) * Math.sqrt(3);
					this.addBlock(block);
				}
			}
		}
	};

	this.rotate = function(steps) {
				if(Date.now()-this.lastRotate<75 && !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) ) return;
		if (!(gameState === 1 || gameState === 0)) return;
		this.position += steps;
		if (!history[this.ct]) {
			history[this.ct] = {};
		}

		if (!history[this.ct].rotate) {
			history[this.ct].rotate = steps;
		}
		else {
			history[this.ct].rotate += steps;
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
				this.lastRotate = Date.now();
	};

	this.draw = function() {
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
			this.angularVelocity -= angularVelocityConst * this.dt;
		}
		else if(this.angle < this.targetAngle) {
			this.angularVelocity += angularVelocityConst * this.dt;
		}

		if (Math.abs(this.angle - this.targetAngle + this.angularVelocity) <= Math.abs(this.angularVelocity)) { //do better soon
			this.angle = this.targetAngle;
			this.angularVelocity = 0;
		}
		else {
			this.angle += this.angularVelocity;
		}
 
		drawPolygon(this.x + gdx, this.y + gdy + this.dy, this.sides, this.sideLength, this.angle,arrayToColor(this.fillColor) , 0, 'rgba(0,0,0,0)');
	};

  this.consolidateBlocks = function (side,index) {
    //record which sides have been changed
    var sidesChanged =[];
    var deleting=[];
    var deletedBlocks = [];
    //add start case
    deleting.push([side,index]);
    //fill deleting	
    floodFill(this, side, index, deleting);
    //make sure there are more than 3 blocks to be deleted
    if (deleting.length < 3) {
      // Check if the combo timer is done and restart the comboTimer in that case
      var now = this.ct;
      if((now - this.lastCombo) > settings.comboTime ) {
        this.comboMultiplier = 1;
      }

      return;
    }
    
    // Explode all hex due to good pacing
    if (this.comboMultiplier > comboPacing) {
      deleteAllHex(this, deleting);
      // Restart the comboMultiplier
      this.comboMultiplier = 1;
      // Increment pacing multiplier
      comboPacing *= 2;
    }
    var i;
    for(i=0; i<deleting.length;i++) {
      var arr = deleting[i];
      //just making sure the arrays are as they should be
      if(arr !== undefined && arr.length==2) {
        //add to sides changed if not in there
        if(sidesChanged.indexOf(arr[0])==-1){
          sidesChanged.push(arr[0]);
        }
        //mark as deleted
        this.blocks[arr[0]][arr[1]].deleted = 1;
        deletedBlocks.push(this.blocks[arr[0]][arr[1]]);
      }
    }
  
    // add scores
    var now = this.ct;
    if(now - this.lastCombo < settings.comboTime ) {
      settings.comboTime = (1/settings.creationSpeedModifier) * (waveone.nextGen/16.666667) * 3;
      this.comboMultiplier += 1;
      this.lastCombo = now;
      var coords = findCenterOfBlocks(deletedBlocks);
      this.texts.push(
        new Text(
          coords['x'],
          coords['y'],
          "x "+ this.comboMultiplier.toString(),
          undefined,
          "#FFF",
          fadeUpAndOut
        )
      );
      if (this.comboMultiplier === comboPacing + 1) {
        const fontSize = 50;
        const basePixelFont = 16;
        setTimeout(() => {
          this.texts.push(
            new Text(
              coords['x'],
              coords['y'],
              'IMPRESSIVE PACING',
              `800 ${( (`${fontSize * settings.scale}20`) / basePixelFont)}rem 'Open Sans'`,
              "#FFF",
              fadeUpAndOut,
              fontSize,
              500,
            )
          );
        }, 500);
      }
    } else {
      settings.comboTime = 240;
      this.lastCombo = now;
      this.comboMultiplier = 1;
    }
    var adder = deleting.length * deleting.length * this.comboMultiplier;
    this.texts.push(
      new Text(
        this.x,
        this.y,
        "+ "+ adder.toString(),
        undefined,
        deletedBlocks[0].color,
        fadeUpAndOut
      )
    );
    this.lastColorScored = deletedBlocks[0].color;
    // Add each colored cracked
    deletedBlocks.forEach((blockDeleted) => {
      scoreByColor[blockDeleted.color] += 1;
    });
    score += adder;
  }
}

function arrayToColor(arr){
	return 'rgb(' + arr[0]+ ','+arr[1]+','+arr[2]+')';
}
