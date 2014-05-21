var colors = ["#e74c3c", "#f1c40f", "#3498db"];
var hexagonBackgroundColor = 'rgb(236, 240, 241)';
var hexagonBackgroundColorClear = 'rgba(236, 240, 241, 0.5)';
var centerBlue = '#2c3e50'; //tumblr?

function showModal(text, secondaryText) {
    var buttonSize = 150;
    var fontSizeLarge = 50;
    var fontSizeSmall = 25;
    drawPolygon(canvas.originalWidth / 2, canvas.originalHeight / 2, 6, canvas.originalWidth / 2 - 25, 30, hexagonBackgroundColorClear);
    // drawPolygon(canvas.originalWidth / 2, canvas.originalHeight / 2, 6, buttonSize, 30, swegBlue);
    ctx.font = fontSizeLarge + 'px Roboto'; // figure out what is not working
    ctx.textAlign = 'center';
    ctx.fillStyle = centerBlue;
    // ctx.fillStyle = hexagonBackgroundColor;
    ctx.fillText(text, canvas.originalWidth / 2, canvas.originalHeight / 2 + (fontSizeLarge / 4));
    ctx.font = fontSizeSmall + 'px Roboto';
    ctx.fillText(secondaryText, canvas.originalWidth / 2, canvas.originalHeight / 2 + fontSizeLarge / 4 + fontSizeSmall / 4 + 30);
}

function renderText(lines, x, y, fontSize) {
    if(typeof lines == 'string' || lines instanceof String) {
        lines = [lines];
    }

    var fontSize = fontSize || 50;

    ctx.font = fontSize + 'px Roboto'; // figure out what is not working
    ctx.textAlign = 'center';
    ctx.fillStyle = 'white';

    for(var i=0; i<lines.length; i++) {
        ctx.fillText(lines[i], x, y + (fontSize / 4) * (i+1) + 30 * i );
    }
}


function clearShadows() {
    ctx.shadowColor = 0;
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
}

function clearGameBoard() {
    ctx.shadowColor = '#2980b9';
    //ctx.shadowBlur = 25;
    drawPolygon(canvas.originalWidth / 2, canvas.originalHeight / 2, 6, canvas.originalWidth / 2 - 25, 30, hexagonBackgroundColor);
    clearShadows();
}

function drawPolygon(x, y, sides, radius, theta, color, fill) { // can make more elegant, reduce redundancy, fix readability
    if (fill == undefined) {
        fill = true;
    }
    if (fill) {
        ctx.fillStyle = color;
    } else {
        // ctx.shadowColor = '#2980b9';
        // ctx.shadowColor = color;
        // ctx.shadowColor = '#2ecc71';
        // ctx.shadowBlur = 10;
        // ctx.strokeStyle = rgba(0,0,0,0);
        ctx.lineWidth = 3;
        ctx.strokeStyle = color;
    }

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
    if (fill) {
        ctx.fill();
    } else {
        ctx.stroke();
    }
};
