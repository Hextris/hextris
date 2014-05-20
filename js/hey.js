floodFill.deleted = [];
function floodFill(clock,side,index) {
	if(clock.blocks[side] !== undefined){return;}
	if(clock.blocks[side][index] !== undefined){return;}
	var  color = clock.blocks[side][index].color;
	var arrX = [-1,0,1];
	var arrY = [-1,0,1];
	for( X in arrX){
		for(Y in arrY){
			var x = arrX[X];
			var y = arrY[Y];
			if(x==0 && y==0){return;}
			if(clock.blocks[(side+x+clock.sides)%clock.sides][index+y] !== undefined){
				if(clock.blocks[(side+x+clock.sides)%clock.sides][index+y].color== color && floodFill.deleted.indexOf([side+x,index+y]) == -1){
					deleted.push([(side+x+clock.sides)%clock.sides,index+y]);
					floodFill(clock,(side+x+clock.sides)%clock.sides,index+y);
					
				}
			}
		}
	}


}
