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

var blocks = [];

for (var i = 0; i < 6, i++) {
	blocks.push(new Block(i, 'green'));
}

(function animloop(){
  requestAnimFrame(animloop);
  render();
})();

function Render() {
	// game code
	blocks.forEach(function(o){
		o.draw();
	})

	ctx.fillRect(200, 200, 200, 200);
}

function Block(lane, color, time) {
	this.lane = lane;
	this.angle = 15 * (Math.PI / 180) + 30 * (Math.PI / 180) * lane;
	this.color = color;

	this.draw = function() {
		ctx.translate(canvas.width / 2, canvas.height / 2);
		ctx.rotate(this.angle);
		ctx.fillStyle = color;
		ctx.fillRect(canvas.width/2 + Math.cos(this.angle) * time, canvas.height/2 + Math.sin(this.angle) * time, 70, 30);
		ctx.restore();
	};

	if (!time) {
		this.time = time;
	}
	else {
		time = 200;
	}
}