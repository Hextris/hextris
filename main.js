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

(function animloop(){
  requestAnimFrame(animloop);
  render();
})();

function render() {
	// game code
	requestAnimFrame(render);
}

function block(lane) {

}