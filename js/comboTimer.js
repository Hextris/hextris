function drawTimer(){
    if(MainClock.ct - MainClock.lastCombo < settings.comboMultiplier){
        for(var i=0;i<6;i++){
            var done = (MainClock.ct -MainClock.lastCombo);
            if(done<(settings.comboMultiplier)*(5-i)*(1/6)){
                drawSide(i,i+1,1);
            }
            else{
                drawSide(i,i+1,1-((done*6)/settings.comboMultiplier)%(1));
                break;
            }
        }
    }
}

function drawSide(startVertex,endVertex,fraction){
    startVertex = startVertex%6;
    endVertex = endVertex%6;
    ctx.globalAlpha=1;
    ctx.beginPath();
    ctx.lineCap = "round";
    if (gameState === 0) {
        ctx.strokeStyle = hexColorsToTintedColors[MainClock.lastColorScored];
    } else {
        ctx.strokeStyle = MainClock.lastColorScored;
    }
    ctx.lineWidth =4;
    var radius = (settings.rows * settings.blockHeight) * (2/Math.sqrt(3)) + settings.hexWidth + 2;
    var halfRadius = radius/2;
    var triHeight = radius *(Math.sqrt(3)/2);
    var Vertexes =[[halfRadius,triHeight],[radius,0],[halfRadius,-triHeight],[-halfRadius,-triHeight],[-radius,0],[-halfRadius,triHeight]].reverse();
    var startX =trueCanvas.width/2 + Vertexes[startVertex][0];
    var startY =trueCanvas.height/2 + Vertexes[startVertex][1];
    var endX = trueCanvas.width/2 + Vertexes[endVertex][0];
    var endY = trueCanvas.height/2 + Vertexes[endVertex][1];
    ctx.moveTo(startX,startY);
    ctx.lineTo(((endX-startX)*fraction)+startX,((endY-startY)*fraction)+startY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}