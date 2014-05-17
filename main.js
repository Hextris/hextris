var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

window.requestAnimFrame = (function(){
	return window.requestAnimationFrame 	||
		window.webkitRequestAnimationFrame	||
		window.mozRequestAnimationFrame		||
		function( callback ) {
			window.setTimeout(callback, 1000 / 60);
		};
})();

var clock = new Clock(6);

var blocks = [];

for (var i = 0; i < 12; i++) {
	blocks.push(new Block(i, 'green'));
}

var MainClock = new Clock(65);

function Render() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	blocks.forEach(function(o){
		o.draw();
		o.distFromHex -= 1/100;
		// o.angle += 1/100;
	});
	MainClock.draw();
	requestAnimFrame(Render);
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

function Block(lane, color, distFromHex) {
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
		this.width = this.distFromHex;
		var p1 = rotatePoint(-this.width/2, this.height/2, this.angle);
		var p2 = rotatePoint(this.width/2, this.height/2, this.angle);
		var p3 = rotatePoint(this.width/2, -this.height/2, this.angle);
		var p4 = rotatePoint(-this.width/2, -this.height/2, this.angle);
		
		ctx.fillStyle="#FF0000";
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

		ctx.strokeStyle = '#322'
		ctx.beginPath();
		ctx.moveTo(canvas.width/2, canvas.height/2);
		ctx.lineTo(canvas.width/2 + Math.sin((this.angle) * (Math.PI/180)) * (this.distFromHex + this.height), canvas.height/2 - Math.cos((this.angle) * (Math.PI/180)) * (this.distFromHex + this.height));
		ctx.closePath();
		ctx.stroke();
	};

}