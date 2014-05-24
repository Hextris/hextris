// In each generator function you need a few things
// Something defining when the next block is being generated
// Something defining which and when the next function is going to be passed

function waveGen(clock) {
	this.lastGen = Date.now();
	this.nextGen = 1500; // - 1500; //delay before starting
	this.start = Date.now();
	this.colors = colors;
	this.ct = 0;
	this.clock = clock;
	this.difficulty = 0;
	
	this.update = function() {
		if (this.difficulty < 15) {
			if (this.difficulty < 8) {
				this.difficulty = Math.floor((Date.now() - this.start)/5000); // every 5 seconds raise the difficulty
			}
			else {
				this.difficulty = Math.floor((Date.now() - this.start)/10000 + 3);
			}
		}
		
		this.currentFunction();
	};

	this.randomGeneration = function() {
		var now = Date.now();
		if (now - this.lastGen > this.nextGen) {
			this.lastGen = now;
			if (this.nextGen > 1000)	{
				if (this.difficulty < 8) {
					this.nextGen -=  15 * ((this.nextGen)/1100);
				}
				else {
					this.nextGen -=  5 * ((this.nextGen)/1100);	
				}
				if (this.difficulty)
				console.log(this.nextGen);
			}
			var fv = randInt(0, 6);
			addNewBlock(fv, colors[randInt(0, colors.length)], 1.5 + (this.difficulty/15) * 3);

			// var nextPattern = randInt(0, 6)
			// if () {
			// 	this.currentFunction = this.
			// }
		}
	};

	// rest of generation functions

	this.currentFunction = this.randomGeneration;
}

function generatorFunction() {
	
}

// In each generator function you need a few things
// Something defining when the next block is being generated
// Something defining which and when the next function is going to be passed