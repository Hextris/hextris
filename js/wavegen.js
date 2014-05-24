// In each generator function you need a few things
// Something defining when the next block is being generated
// Something defining which and when the next function is going to be passed

function waveGen(clock) {
	this.lastGen = Date.now();
	this.nextGen = 1500; // - 1500; //delay before starting
	this.start = Date.now();
	this.colors = colors;
	this.clock = clock;
	this.difficulty = 0;
	
	this.update = function() {
		if (this.difficulty < 15) {
			this.difficulty = Math.floor((Date.now() - this.start)/10000); // every 20 seconds raise the difficulty
		}
		debugger;
		this.currentFunction();
	};

	this.randomGeneration = function() {
		var now = Date.now();
		if (now - this.lastGen > this.nextGen) {
			this.lastGen = now;
			if (this.nextGen > 500)	{
				this.nextGen -=  10 * ((this.nextGen - 200)/1000);
			}
			var fv = randInt(0, 6);
			addNewBlock(fv, colors[randInt(0, colors.length)], 1 + (this.difficulty/15) * 3);

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