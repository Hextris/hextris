// main thing here

window.requestAnimFrame = (function(){
	return window.requestAnimationFrame 	||
		window.webkitRequestAnimationFrame	||
		window.mozRequestAnimationFrame		||
		function( callback ){
			window.setTimeout(callback, 1000 / 60);
		};
})();

(function animloop(){
  requestAnimFrame(animloop);
  render();
})();

function render() {
	requestAnimFrame(animloop);
	drawClock(10, 10, 0, 6);

}

function drawClock(x, y, sides, sideLength, theta) {
	ctx.beginPath();
	ctx.moveTo(0, sideLength);
	for (var i = 0; i < sides; i++) {
		var coords = rotatePoint(x, y, degToRadians(60)); 
		ctx.lineTo(coords.x, coords.y);
		ctx.moveTo(coords.x, coords.y);
	}
	ctx.stroke();
}

function degToRadians(degrees) {
	return ((Math.PI) / 180) * degrees; 
}f