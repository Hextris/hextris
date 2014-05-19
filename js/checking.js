function verticalScore(clock,side,index){
	var color = clock.blocks[side][index].color;
	var upcount =0;
	while(clock.blocks[side][index+upcount+1] !== undefined) {
		if(clock.blocks[side][index+upcount+1].color == color) {
			upcount++;	
		}
		else {
			break;
		}
	}
	var downcount =0;
	while(clock.blocks[side][index-downcount-1] !== undefined) {
		if(clock.blocks[side][index-downcount-1].color == color) {
			downcount++;
		}
		else {
			break;
		}
	}
	if(downcount+upcount>=2){

		return true;
	}
	return false;
}
function horizontalScore(clock,side,index){
	var color = clock.blocks[side][index].color;
	var upcount =0;
	while(clock.blocks[(side+upcount+1)%clock.sides][index] !== undefined) {
		if(clock.blocks[(side+upcount+1)%clock.sides][index].color == color) {
			upcount++;	
		}
		else {
			break;
		}
	}
	var downcount =0;
	while(clock.blocks[(side-downcount-1+clock.sides)%clock.sides][index] !== undefined) {
		if(clock.blocks[(side-downcount-1+clock.sides)%clock.sides][index].color == color) {
			downcount++;
		}
		else {
			break;
		}
	}
	if(downcount+upcount>=2){

		return true;
	}
	return false;

}
function consolidateBlocks(clock, side, index) {
	var sidesChanged = [];
	if (clock.blocks[side][index] !== undefined){
		var color = clock.blocks[side][index].color;
		var count =1;
		if(verticalScore(clock,side,index)){
			console.log("hey");
			sidesChanged.push(side);
			while(clock.blocks[side][index-count] !== undefined) {
				if(clock.blocks[side][index-count].color == color) {
					clock.blocks[side].splice(index-1,1);
					index--;
				}
				else {
					break;
				}
			}
			var count=0;
			while(clock.blocks[side][index+count] !== undefined) {
				if(clock.blocks[side][index+count].color == color) {
					clock.blocks[side].splice(index,1);
				}
				else {
					break;
				}
			}
			for(var i=index;i<clock.blocks[side].length;i++) {
				consolidateBlocks(clock,side,i);
			}
		}

	}
	if (clock.blocks[side][index] !== undefined){
		if(horizontalScore(clock,side,index)){
			sidesChanged.push(side);
			console.log(sidesChanged);
			var count=1;
			var x=(side-count+clock.sides)%clock.sides;
			while(clock.blocks[x][index] !== undefined) {
				if(clock.blocks[x][index].color == color) {
					sidesChanged.push(x);
					clock.blocks[x].splice(index,1);
					consolidateBlocks(clock,x,index);
					count++;
				}
				else {
					break;
				}
				x=(side-count+clock.sides)%clock.sides;
			}
			var count=0;
			var x = (side+count+clock.sides)%clock.sides;
			while(clock.blocks[x][index] !== undefined) {
				if(clock.blocks[x][index].color == color) {
					sidesChanged.push(x);
					clock.blocks[x].splice(index,1);
					consolidateBlocks(clock,x,index);
					count++;
				}
				else {
					break;
				}
				x = (side+count+clock.sides)%clock.sides;
			}
			console.log(sidesChanged);
		}
	}
	
	sidesChanged.forEach(function(o) {
		MainClock.blocks[o].forEach(function(block) {
			console.log('unsettled');
		    block.settled = 0;
		})
	});

}
