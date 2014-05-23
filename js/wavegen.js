function waveGen(clock, start, jumps, simultaneousShots, colorJumps) {
	this.lastGen = Date.now();
	this.prevScore = Date.now();
	this.nextGen = 1500;
	this.start = start;
	this.jumps = jumps;
	this.simultaneousShots = simultaneousShots;
	this.colors = colors;
	this.clock = clock;
	this.update = function() {
		var now = Date.now();
		if (now - this.lastGen > this.nextGen) {
			// for(var i=this.jumps.length-1;i>0;i--) {
			// 	this.jumps[i-1] = (this.jumps[i-1]+this.jumps[i])%this.clock.sides;
			// }
			// for(var i=this.simultaneousShots.length-1;i>0;i--) {
			// 	this.simultaneousShots[i-1] = (this.simultaneousShots[i-1]+this.simultaneousShots[i])%this.clock.sides;
			// }
			this.lastGen = Date.now();
			var minTime = 500 / iter;
			if (minTime < 100) {
			    minTime = 100;
			}
			if(this.nextGen > 400){
			    this.nextGen -= 10 * ((this.nextGen - 200)/1000);
			}
			var fv = randInt(0, 6);
			addNewBlock(fv, colors[randInt(0, colors.length)]);
			addNewBlock((fv + 1) % 6, colors[randInt(0, colors.length)]);
		}
	}
}
