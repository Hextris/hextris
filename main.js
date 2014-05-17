var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var gameState = 1; // 0 - start, 1 - playing, 2 - end
var framerate = 60;

window.requestAnimFrame = (function(){
	return window.requestAnimationFrame	||
	window.webkitRequestAnimationFrame	||
	window.mozRequestAnimationFrame		||
	function( callback ) {
		window.setTimeout(callback, 1000 / framerate);
	};
})();

var clock = new Clock(6);

var blocks = [];
var MainClock = new Clock(65);
var iter = 1;
var lastGen = Date.now();
var nextGen = 1000;

var colors = ["#e74c3c", "#f1c40f","#3498db"];
var hexagonBackgroundColor = '#ecf0f1';
var swegBlue = '#2c3e50'; //tumblr?

function render() {
	var now = Date.now();
	if(now - lastGen > nextGen) {
		blocks.push(new Block(randInt(0, 6), colors[randInt(0, colors.length)]));
		lastGen = Date.now();
		nextGen = randInt(500, 1500);
	}
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawPolygon(canvas.width / 2, canvas.height / 2, 6, canvas.width / 2, 30, hexagonBackgroundColor);
	var objectsToRemove = [];
	var i;
	for (i in MainClock.blocks) {
		for (var j = 0; j < MainClock.blocks[i].length; j++) {
			var block = MainClock.blocks[i][j];
			MainClock.doesBlockCollide(block, iter, j, MainClock.blocks[i]);
			if (!MainClock.blocks[i][j].settled) {
				MainClock.blocks[i][j].distFromHex -= iter;
			}
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
	if (gameState == 1) {
		requestAnimFrame(animloop);
		render();
		checkGameOver();
	}
	else if (gameState == 2) {
		showModal('Game Over');
	}
})();

function drawPolygon(x, y, sides, radius, theta, color) { // can make more elegant, reduce redundancy, fix readability
	ctx.fillStyle = color;
	ctx.beginPath();
	var coords = rotatePoint(0, radius, theta);
	ctx.moveTo(coords.x + x, coords.y + y);
	var oldX = coords.x;
	var oldY = coords.y;
	for (var i = 0; i < sides; i++) {
		coords = rotatePoint(oldX, oldY, 360 / sides); 
		ctx.lineTo(coords.x + x, coords.y + y);
		// ctx.moveTo(coords.x + x, coords.y + y);
		oldX = coords.x;
		oldY = coords.y;
	}
	ctx.closePath();
	ctx.fill();
};

function checkGameOver() { // fix font, fix size of hex
	for(var i=0; i<MainClock.sides;i++) {
		if(MainClock.blocks[i].length>5)
		{
			gameState = 2;	
		}
	}
}

function showModal(text) {
	drawPolygon(canvas.width / 2, canvas.height / 2, 6, canvas.width / 2, 30, hexagonBackgroundColor);
	ctx.fillStyle = swegBlue;
	ctx.font = '40pt "Helvetica Neue"';
	ctx.textAlign = 'center';
	ctx.fillText(text, canvas.width / 2, canvas.height / 2);
}