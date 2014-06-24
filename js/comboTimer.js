function drawTimer(){
    if(MainClock.ct - MainClock.lastCombo < settings.comboMultiplier){
        var third = settings.comboMultiplier/3;
        if(settings.comboMultiplier -(MainClock.ct-MainClock.lastCombo)>(third*2)) {
                var done = ((settings.comboMultiplier -(MainClock.ct-MainClock.lastCombo))%(third*2))/(third*2);
                drawSide(4,5,1);
                drawSide(5,0,done);
                drawSide(1,0,1);
                drawSide(0,5,done);
                drawSide(1,2,1);
                drawSide(2,3,done);
                drawSide(4,3,1);
                drawSide(3,2,done);
        }
        else{
                var done = (settings.comboMultiplier -(MainClock.ct-MainClock.lastCombo))/(third*2);
                drawSide(1,0,done);
                drawSide(1,2,done);
                drawSide(4,3,done);
                drawSide(4,5,done);
        }
    }
}

function drawSide(startVertex,endVertex,fraction){
    startVertex = startVertex%6;
    endVertex = endVertex%6;
    ctx.globalAlpha=1;
    ctx.beginPath();
    ctx.lineCap = "round"
    ctx.strokeStyle=MainClock.lastColorScored;
    ctx.lineWidth =4;
    var radius = (settings.rows * settings.blockHeight) * (2/Math.sqrt(3)) + settings.hexWidth;
    var halfRadius = radius/2;
    var triHeight = radius *(Math.sqrt(3)/2);
    var hexagonPoints =[[halfRadius,triHeight],[radius,0],[halfRadius,-triHeight],[-halfRadius,-triHeight],[-radius,0],[-halfRadius,triHeight]].reverse();
    var startX =trueCanvas.width/2 + hexagonPoints[startVertex][0]; 
    var startY =trueCanvas.height/2 + hexagonPoints[startVertex][1]; 
    var endX = trueCanvas.width/2 + hexagonPoints[endVertex][0];
    var endY = trueCanvas.height/2 + hexagonPoints[endVertex][1];
    ctx.moveTo(startX,startY);
    ctx.lineTo(((endX-startX)*fraction)+startX,((endY-startY)*fraction)+startY);
    ctx.closePath()
    ctx.fill()
    ctx.stroke();
} 
