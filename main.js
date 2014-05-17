var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
ct = 0;
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

for (var i = 0; i < 1; i++) {
	blocks.push(new Block(i, 'green'));
}

var MainClock = new Clock(65);
var iter = 1;

function Render() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	var objectsToRemove = [];
	MainClock.blocks.forEach(function(hexBlocks){
		for (var i = 0; i < hexBlocks.length; i++) {
			MainClock.doesBlockCollide(hexBlocks[i], iter, i);
			if (!hexBlocks[i].settled) {
				hexBlocks[i].distFromHex -= iter;
			}
			
			hexBlocks[i].draw();
		}
	});

	for (var i in blocks) {
		MainClock.doesBlockCollide(blocks[i], iter);
		if (!blocks[i].settled) {
			blocks[i].distFromHex -= iter;
		} else {
			objectsToRemove.push(blocks[i]);
		}
		blocks[i].draw();
	}

	objectsToRemove.forEach(function(o){
		blocks.splice(o,1);
	});
	ct++;
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