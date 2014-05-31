// In each generator function you need a few things
// Something defining when the next block is being generated
// Something defining which and when the next function is going to be passed

function waveGen(clock) {
	this.lastGen = 0;
	this.last = 0;
	this.nextGen = 1300; // - 1500; //delay before starting
	this.start = 0;
	this.colors = colors;
	this.ct = 0;
	this.clock = clock;
	this.difficulty = 0;
	this.integerDifficulty = this.difficulty;
	this.dt = 0;
	this.update = function() {
		this.currentFunction();
		this.dt += 16.6666667 * spaceModifier;
		this.computeDifficulty();
		if (this.dt - this.lastGen * (1/settings.creationSpeedModifier) > this.nextGen) {
			if (this.nextGen > 1000) {
				this.nextGen -=  (3 * (this.nextGen/1300)) * settings.creationSpeedModifier;
			}
		}
	};

	this.randomGeneration = function() {
		if (this.dt - this.lastGen > this.nextGen) {
			this.ct++;
			this.lastGen = this.dt;
			var fv = randInt(0, MainClock.sides);
			addNewBlock(fv, colors[randInt(0, colors.length)], 1.5 + (this.integerDifficulty/15) * 3);
			if (this.ct > 7) {
				var nextPattern = randInt(0, 20 + 4);
				if (nextPattern > 4 + 17) {
					this.ct = 0;
					this.currentFunction = this.doubleGeneration;
				} else if (nextPattern > 4 + 14) {
					this.ct = 0;
					this.currentFunction = this.crosswiseGeneration;
				} else if (nextPattern > 4 + 11) {
					this.ct = 0;
					this.currentFunction = this.spiralGeneration;
				}
				else if (nextPattern > 4 + 8) {
					this.ct = 0;
					this.currentFunction = this.circleGeneration;
				}
			}

		}
	};

	this.computeDifficulty = function() {
		if (this.difficulty < 11) {
			if (this.difficulty < 8) {
				this.difficulty += (this.dt - this.last)/250000;
			}
			else {
				this.difficulty += (this.dt - this.last)/5000000;
			}
		}
		this.integerDifficulty = Math.floor(this.difficulty);
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

			for (var i = 0; i < MainClock.sides; i++) {
				addNewBlock(i, colorList[i % numColors], 1.5 + (this.integerDifficulty/15) * 3);
			}

			this.ct += 15;
			this.lastGen = this.dt;
			this.shouldChangePattern(1);
		}
	};

	this.crosswiseGeneration = function() {
		if (this.dt - this.lastGen > this.nextGen) {
			var ri = randInt(0, colors.length);
			var i = randInt(0, colors.length);
			addNewBlock(i, colors[ri], 0.6 + (this.integerDifficulty/15) * 3);
			addNewBlock((i + 3) % MainClock.sides, colors[ri], 0.6 + (this.integerDifficulty/15) * 3);
			this.ct += 1.5;
			this.lastGen = this.dt;
			this.shouldChangePattern();
		}
	};

	this.spiralGeneration = function() {
		var dir = randInt(0, 2);
		if (this.dt - this.lastGen > this.nextGen * (5/9)) {
			if (dir) {
				addNewBlock(5 - (this.ct % MainClock.sides), colors[randInt(0, colors.length)], 1.5 + (this.integerDifficulty/15) * (3/2));
			}
			else {
				addNewBlock(this.ct % MainClock.sides, colors[randInt(0, colors.length)], 1.5 + (this.integerDifficulty/15) * (3/2));
			}
			this.ct += 1;
			this.lastGen = this.dt;
			this.shouldChangePattern();
		}
	};

	this.doubleGeneration = function() {
		if (this.dt - this.lastGen > this.nextGen) {
			var i = randInt(0, colors.length);
			addNewBlock(i, colors[randInt(0, colors.length)], 1.5 + (this.integerDifficulty/15) * 3);
			addNewBlock((i + 1) % MainClock.sides, colors[randInt(0, colors.length)], 1.5 + (this.integerDifficulty/15) * 3);
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

function generatorFunction() {
	
}

// In each generator function you need a few things
// Something defining when the next block is being generated
// Something defining which and when the next function is going to be passed
