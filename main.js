var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
window.requestAnimFrame = (function(){
	return window.requestAnimationFrame		||
		window.webkitRequestAnimationFrame	||
		window.mozRequestAnimationFrame		||
		function( callback ) {
			window.setTimeout(callback, 1000 / 60);
		};
})();

var clock = new Clock(6);

var blocks = [];

var MainClock = new Clock(65);
var iter = 1;
var lastGen = Date.now();
var nextGen = 1000;

var colors = ["green", "red"];

function Render() {
	var now = Date.now();
	if(now - lastGen > nextGen) {
		if (doRand) {
			blocks.push(new Block(randInt(0, 6), colors[randInt(0, colors.length-1)]));
		}
		lastGen = Date.now();
		nextGen = randInt(500, 1500);
	}

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	var objectsToRemove = [];
	var i;
	for (i in MainClock.blocks) {
		for (var j = 0; j < MainClock.blocks[i].length; j++) {
			var block = MainClock.blocks[i][j];
			MainClock.doesBlockCollide(block, iter);
			block.draw();
		}
	}

	for (i in blocks) {
		MainClock.doesBlockCollide(blocks[i], iter);
		if (!blocks[i].settled) {
			blocks[i].distFromHex -= iter;
		}
		else {
			objectsToRemove.push(i);
		}
		blocks[i].draw();
	}

	objectsToRemove.forEach(function(o){
		blocks.splice(o, 1);
	});
	MainClock.draw();
}

(function animloop(){
	requestAnimFrame(animloop);
	Render();
})();

function drawPolygon(x, y, sides, radius, theta) {
	ctx.beginPath();
	ctx.moveTo(x, y + radius);
	var oldX = 0;
	var oldY = radius;
	for (var i = 0; i < sides; i++) {
		var coords = rotatePoint(oldX, oldY, 360 / sides);
		ctx.lineTo(coords.x + x, coords.y + y);
		ctx.moveTo(coords.x + x, coords.y + y);
		oldX = coords.x;
		oldY = coords.y;
	}
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
}