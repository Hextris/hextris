function blockDestroyed() {
	if (waveone.nextGen > 1000) {
		waveone.nextGen -= 10;
	} else {
		waveone.nextGen = 1000;
	}

	if (waveone.difficulty < 15) {
		waveone.difficulty += 0.04;
	} else {
		waveone.difficulty = 15;
	}
}

function waveGen(hex) {
	this.lastGen = 0;
	this.last = 0;
	this.nextGen = 3000;
	this.start = 0;
	this.colors = colors;
	this.ct = 0;
	this.hex = hex;
	this.difficulty = 1;
	this.dt = 0;
	this.update = function() {
		this.currentFunction();
		this.dt += 16.6666667;
		this.computeDifficulty();
		if ((this.dt - this.lastGen) > this.nextGen) {
			if (this.nextGen > 900) {
				this.nextGen -=  4.5 * ((this.nextGen/1300)) * settings.creationSpeedModifier;
			}
		}
	};

	this.randomGeneration = function() {
		if (this.dt - this.lastGen > this.nextGen) {
			this.ct++;
			this.lastGen = this.dt;
			var fv = randInt(0, MainHex.sides);
			addNewBlock(fv, colors[randInt(0, colors.length)], 1.6 + (this.difficulty/15) * 3);
			if (this.ct > 7) {
				// var nextPattern = randInt(0, 20 + 8);
				// if (nextPattern > 8 + 17) {
				// 	this.ct = 0;
				// 	this.currentFunction = this.doubleGeneration;
				// } else if (nextPattern > 8 + 14) {
				// 	this.ct = 0;
				// 	this.currentFunction = this.crosswiseGeneration;
				// } else if (nextPattern > 8 + 11) {
				// 	this.ct = 0;
				// 	this.currentFunction = this.spiralGeneration;
				// } else if (nextPattern > 8 + 8) {
				// 	this.ct = 0;
				// 	this.currentFunction = this.circleGeneration;
				// } else if (nextPattern > 8 + 5) {
				// 	this.ct = 0;
					this.currentFunction = this.halfCircleGeneration;
					this.ct = 0
				// }
			}

		}
	};

	this.computeDifficulty = function() {
		if (this.difficulty < 15) {
			if (this.difficulty < 8) {
				this.difficulty += (this.dt - this.last)/(2000000);
			}
			else {
				this.difficulty += (this.dt - this.last)/(40000000);
			}
		}
	};

	this.circleGeneration = function() {
		if (this.dt - this.lastGen > this.nextGen + 500) {
			var numColors = randInt(1, 4);
			if (numColors == 3) {
				numColors = randInt(1, 4);
			}

			var colorList = [];
			nextLoop:
			for (var i = 0; i < numColors; i++) {
				var q = randInt(0, colors.length);
				for (var j in colorList) {
					if (colorList[j] == colors[q]) {
						i--;
						continue nextLoop;
					}
				}
				colorList.push(colors[q]);
			}

			for (var i = 0; i < MainHex.sides; i++) {
				addNewBlock(i, colorList[i % numColors], 1.5 + (this.difficulty/15) * 3);
			}

			this.ct += 15;
			this.lastGen = this.dt;
			this.shouldChangePattern(1);
		}
	};

	this.halfCircleGeneration = function() {
		if (this.dt - this.lastGen > (this.nextGen+500)/2) {
			var numColors = randInt(1, 3);
			var c = colors[randInt(0, colors.length)];
			var colorList = [c, c, c];
			if (numColors == 2) {
				colorList = [c, colors[randInt(0, colors.length)],c];
			}

			var d = randInt(0,6);
			for (var i = 0; i < 3; i++) {
				addNewBlock((d+i) % 6, colorList[i], 1.5 + (this.difficulty/15) * 3);
			}

			this.ct += 5;
			this.lastGen = this.dt;
			this.shouldChangePattern();
		}
	};

	this.crosswiseGeneration = function() {
		if (this.dt - this.lastGen > this.nextGen) {
			var ri = randInt(0, colors.length);
			var i = randInt(0, colors.length);
			addNewBlock(i, colors[ri], 0.6 + (this.difficulty/15) * 3);
			addNewBlock((i + 3) % MainHex.sides, colors[ri], 0.6 + (this.difficulty/15) * 3);
			this.ct += 1.5;
			this.lastGen = this.dt;
			this.shouldChangePattern();
		}
	};

	this.spiralGeneration = function() {
		var dir = randInt(0, 2);
		if (this.dt - this.lastGen > this.nextGen * (5/9)) {
			if (dir) {
				addNewBlock(5 - (this.ct % MainHex.sides), colors[randInt(0, colors.length)], 1.5 + (this.difficulty/15) * (3/2));
			}
			else {
				addNewBlock(this.ct % MainHex.sides, colors[randInt(0, colors.length)], 1.5 + (this.difficulty/15) * (3/2));
			}
			this.ct += 1;
			this.lastGen = this.dt;
			this.shouldChangePattern();
		}
	};

	this.doubleGeneration = function() {
		if (this.dt - this.lastGen > this.nextGen) {
			var i = randInt(0, colors.length);
			addNewBlock(i, colors[randInt(0, colors.length)], 1.5 + (this.difficulty/15) * 3);
			addNewBlock((i + 1) % MainHex.sides, colors[randInt(0, colors.length)], 1.5 + (this.difficulty/15) * 3);
			this.ct += 2;
			this.lastGen = this.dt;
			this.shouldChangePattern();
		}
	};

	this.setRandom = function() {
		this.ct = 0;
		this.currentFunction = this.randomGeneration;
	};

	this.shouldChangePattern = function(x) {
		if (x) {
			var q = randInt(0, 4);
			this.ct = 0;
			switch (q) {
				case 0:
					this.currentFunction = this.doubleGeneration;
					break;
				case 1:
					this.currentFunction = this.spiralGeneration;
					break;
				case 2:
					this.currentFunction = this.crosswiseGeneration;
					break;
			}
		}
		else if (this.ct > 8) {
			if (randInt(0, 2) === 0) {
				this.setRandom();
				return 1;
			}
		}

		return 0;
	};

	// rest of generation functions

	this.currentFunction = this.randomGeneration;
}