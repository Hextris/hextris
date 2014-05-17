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

var MainClock = new Clock(65);
var iter = 1/100;
var lastGen = Date.now();
var nextGen = 1000;

var colors = ["green", "red"];

function Render() {
	var now = Date.now();
	if(now - lastGen > nextGen) {
		console.log("YES coachh");
		blocks.push(new Block(randInt(0, 5), colors[randInt(0, colors.length-1)]));
		lastGen = Date.now();
		nextGen = randInt(100, 500);
		console.log(nextGen);
	}

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

function Block(lane, color, distFromHex, settled) {
	this.settled = (settled == undefined) ? 0 : 1;
	this.height = 20;
	this.width = 65;
	this.lane = lane;
	this.angle = 90 - (30 + 60 * lane);
	if (this.angle < 0) {
		this.angle += 360;
	}

	this.color = color;
	
	if (distFromHex) {
		this.distFromHex = distFromHex;
	}
	else {
		this.distFromHex = 300;
	}
	this.draw = function() {
		this.angle = 90 - (30 + 60 * this.lane);

		this.width = 2 * this.distFromHex / Math.sqrt(3);
		this.widthswag = this.width + this.height + 5;
		var p1 = rotatePoint(-this.width/2, this.height/2, this.angle);
		var p2 = rotatePoint(this.width/2, this.height/2, this.angle);
		var p3 = rotatePoint(this.widthswag/2, -this.height/2, this.angle);
		var p4 = rotatePoint(-this.widthswag/2, -this.height/2, this.angle);
		
		ctx.fillStyle=this.color;
		var baseX = canvas.width/2 + Math.sin((this.angle) * (Math.PI/180)) * (this.distFromHex + this.height/2);
		var baseY = canvas.height/2 - Math.cos((this.angle) * (Math.PI/180)) * (this.distFromHex + this.height/2);

		ctx.beginPath();
		ctx.moveTo(Math.round(baseX + p1.x), Math.round(baseY + p1.y));
		ctx.lineTo(Math.round(baseX + p2.x), Math.round(baseY + p2.y));
		ctx.lineTo(Math.round(baseX + p3.x), Math.round(baseY + p3.y));
		ctx.lineTo(Math.round(baseX + p4.x), Math.round(baseY + p4.y));
		ctx.lineTo(Math.round(baseX + p1.x), Math.round(baseY + p1.y));
		ctx.closePath();
		ctx.fill();

		// ctx.strokeStyle = '#322'
		// ctx.beginPath();
		// ctx.moveTo(canvas.width/2, canvas.height/2);
		// ctx.lineTo(canvas.width/2 + Math.sin((this.angle) * (Math.PI/180)) * (this.distFromHex + this.height), canvas.height/2 - Math.cos((this.angle) * (Math.PI/180)) * (this.distFromHex + this.height));
		// ctx.closePath();
		// ctx.stroke();
	};

}
