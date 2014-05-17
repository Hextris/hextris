function getIndex(list,index) {
	if(index>-1) {
		return index%list.length;
	}
	else {
		return list.length+index;
	}
}
function scoreCheckHorizontal(clock,side,index) {
	clockSides = clock.blocks;
	if(clockSides[getIndex(clockSides,side)][index] && clockSides[getIndex(clockSides,side-1)][index] && clockSides[getIndex(clockSides,side-2)][index]) {
		if(clockSides[getIndex(clockSides,side)][index].color ==  clockSides[getIndex(clockSides,side-1)][index].color &&  clockSides[getIndex(clockSides,side-1)][index].color  ==  clockSides[getIndex(clockSides,side-2)][index].color) {
			return -2;
		}
	}
	if(clockSides[getIndex(clockSides,side)][index] && clockSides[getIndex(clockSides,side+1)][index] && clockSides[getIndex(clockSides,side-1)][index]) {
		if(clockSides[getIndex(clockSides,side)][index].color ==  clockSides[getIndex(clockSides,side+1)][index].color &&  clockSides[getIndex(clockSides,side+1)][index].color  ==  clockSides[getIndex(clockSides,side-1)][index].color) {
			return -1;
		}
	}
	if(clockSides[getIndex(clockSides,side)][index] && clockSides[getIndex(clockSides,side+1)][index] && clockSides[getIndex(clockSides,side+2)][index]) {
		if(clockSides[getIndex(clockSides,side)][index].color ==  clockSides[getIndex(clockSides,side+1)][index].color &&  clockSides[getIndex(clockSides,side+1)][index].color  ==  clockSides[getIndex(clockSides,side+2)][index].color) {
			return	0;
		}
	}
	return "false";
}
	
function scoreCheckVertical(clock,side,index) {
	curSide = clock.blocks[side];
	if(curSide[index] && curSide[index-2] && curSide[index-1]) {
		if(curSide[index].color == curSide[index-2].color && curSide[index-2].color ==curSide[index-1].color) {
			return -2;
		}
	}

	if(curSide[index] && curSide[index+1] && curSide[index-1]) {
		if(curSide[index].color == curSide[index+1].color && curSide[index+1].color == curSide[index-1].color) {
			return -1;
		}
	}

	if(curSide[index] && curSide[index+2] && curSide[index+1]) {
		if(curSide[index].color == curSide[index+2].color&& curSide[index+2].color  ==curSide[index+1].color) {
			return 0;
		}
	}
	return "false";
}
function consolidateBlocks(clock,side,index) {
	horizontal = scoreCheckHorizontal(clock,side,index);
	vertical = scoreCheckVertical(clock,side,index);
	deleted = [];
	if(horizontal != "false") {
		deleted.push([side,index,horizontal]);
	}
	else {
		deleted.push([]);
	}
	if(vertical != "false") {
		deleted.push([side,index,vertical]);
	}
	else {
		deleted.push([]);
	}
	eraseBlocks(clock,deleted);
}
function eraseBlocks(clock,deleted) {
	if(deleted[0].length>0){
		side = deleted[0][0];
		index = deleted[0][1];
		horizontal = deleted[0][2];
		for(var i=0;i<3;i++) {
			clock.blocks[getIndex(clock.blocks,side+horizontal+i)].splice(index,1);
		}
		for(var i=0;i<3;i++) {
			if(side+horizontal+i<clock.blocks.length) {
				consolidateBlocks(clock,getIndex(clock.blocks,side+horizontal+i),index);
			}
		}
	}
	if(deleted[1].length>0){
		side = deleted[1][0];
		index = deleted[1][1];
		vertical = deleted[1][2];
		clock.blocks[side].splice(index+vertical,2+(1*(!deleted[0].length>0)));
		for(var i=0; i<clock.blocks[side].length-(index+vertical); i++) {
			consolidateBlocks(clock,side,index+vertical+i);
		}
	}
}
