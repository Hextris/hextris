var colors = ["rgb(231,76,60)", "rgb(241,196,15)", "rgb(52,152,219)", "rgb(46,204,113)"];
var hexagonBackgroundColor = 'rgb(236, 240, 241)';
var hexagonBackgroundColorClear = 'rgba(236, 240, 241, 0.5)';
var centerBlue = 'rgb(44,62,80)'; //tumblr?

function renderText(x, y, fontSize, color, text) {
    fontSize *= settings.scale;
    ctx.font = fontSize + 'px/0 Roboto';
    ctx.textAlign = 'center';
    ctx.fillStyle = color;
    ctx.fillText(text, x, y + (fontSize / 2) - 9 * settings.scale);
}

scoreOpacity = 0;
function drawScoreboard() {
    if(scoreOpacity < 1){
	scoreOpacity+=0.01;
    }
    ctx.globalAlpha = scoreOpacity;
    renderText(trueCanvas.width/2+ gdx, trueCanvas.height/2+ gdy, 50, "#fff", score);
    ctx.globalAlpha = 1;
}

function clearGameBoard() {
    drawPolygon(trueCanvas.width / 2, trueCanvas.height / 2, 6, trueCanvas.width / 2, 30, hexagonBackgroundColor, 0, 'rgba(0,0,0,0)');
}

function drawPolygon(x, y, sides, radius, theta, fillColor, lineWidth, lineColor) {
    ctx.fillStyle = fillColor;
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = lineColor;
    
    ctx.beginPath();
    var coords = rotatePoint(0, radius, theta);
    ctx.moveTo(coords.x + x, coords.y + y);
    var oldX = coords.x;
    var oldY = coords.y;
    for (var i = 0; i < sides; i++) {
        coords = rotatePoint(oldX, oldY, 360 / sides);
        ctx.lineTo(coords.x + x, coords.y + y);
        oldX = coords.x;
        oldY = coords.y;
    }

    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = 'rgba(0,0,0,0)';
}

function showHighScores() {
    $('#highscores').html(function() {
        var str = '<li> High Scores: </li>';
        for (var i = 0; i < highscores.length; i++) {
            str += '<li>' + highscores[i]+ '</li>';
        }
        return str;
    });
    toggleClass('#highscores', 'not-visible');
}

function toggleClass(element, active) {
    if ($(element).hasClass(active)) {
        $(element).removeClass(active);
    }
    else {
        $(element).addClass(active);
    }
}
