// HackExeter
function rotatePoint(x, y, theta) {
	var thetaRad = theta * (Math.PI / 180);
	var rotX = Math.cos(thetaRad) * x - Math.sin(thetaRad) * y;
	var rotY = Math.sin(thetaRad) * x + Math.cos(thetaRad) * y;

	return { 
		x: rotX,
		y: rotY,
	};
}

function randInt(min, max) {
	return Math.floor((Math.random() * max) + min);
}

//http://stackoverflow.com/questions/15397036/drawing-dashed-lines-on-html5-canvas
CanvasRenderingContext2D.prototype.dashedLine = function (x1, y1, x2, y2, dashLen) {
    if (dashLen == undefined) dashLen = 2;
    this.moveTo(x1, y1);

    var dX = x2 - x1;
    var dY = y2 - y1;
    var dashes = Math.floor(Math.sqrt(dX * dX + dY * dY) / dashLen);
    var dashX = dX / dashes;
    var dashY = dY / dashes;

    var q = 0;
    while (q++ < dashes) {
        x1 += dashX;
        y1 += dashY;
        this[q % 2 == 0 ? 'moveTo' : 'lineTo'](x1, y1);
    }
    this[q % 2 == 0 ? 'moveTo' : 'lineTo'](x2, y2);
};
