// main thing here
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

window.requestAnimFrame = (function(){
	return window.requestAnimationFrame 		||
		window.webkitRequestAnimationFrame	||
		window.mozRequestAnimationFrame		||
		function( callback ){
			window.setTimeout(callback, 1000 / 60);
		};
})();

clock = new Clock(6);

var blocks = [];

for (var i = 0; i < 6; i++) {
	blocks.push(new Block(i, 'green'));
}

Render();

function Render() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	blocks.forEach(function(o){
		o.draw();
	});
	requestAnimFrame(Render);
}

function Block(lane, color, time) {
	this.lane = lane;
	this.angle = 15 * (Math.PI / 180) + 30 * (Math.PI / 180) * lane;
	this.color = color;

	this.draw = function() {
		ctx.translate(canvas.width / 2, canvas.height / 2);
		ctx.rotate(this.angle);
		ctx.fillStyle = '#000';
		ctx.fillRect(canvas.width/2 + Math.cos(this.angle) * time, canvas.height/2 + Math.sin(this.angle) * time, 30, 30);
		ctx.restore();
		ctx.fillRect(200, 200, 200, 200);
	};

	if (!time) {
		this.time = time;
	}
	else {
		time = 200;
	}
}