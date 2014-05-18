// HackExeter
function getIndex(list, index) {
    if (index > -1) {
        return index % list.length;
    } else {
        return list.length + index;
    }
}
function scoreCheckHorizontal(clock, side, index) {
    clockSides = clock.blocks;
    if (clockSides[getIndex(clockSides, side)][index] && clockSides[getIndex(clockSides, side - 1)][index] && clockSides[getIndex(clockSides, side - 2)][index]) {
        if (clockSides[getIndex(clockSides, side)][index].color == clockSides[getIndex(clockSides, side - 1)][index].color && clockSides[getIndex(clockSides, side - 1)][index].color == clockSides[getIndex(clockSides, side - 2)][index].color) {
            return -2;
        }
    }
    if (clockSides[getIndex(clockSides, side)][index] && clockSides[getIndex(clockSides, side + 1)][index] && clockSides[getIndex(clockSides, side - 1)][index]) {
        if (clockSides[getIndex(clockSides, side)][index].color == clockSides[getIndex(clockSides, side + 1)][index].color && clockSides[getIndex(clockSides, side + 1)][index].color == clockSides[getIndex(clockSides, side - 1)][index].color) {
            return -1;
        }
    }
    if (clockSides[getIndex(clockSides, side)][index] && clockSides[getIndex(clockSides, side + 1)][index] && clockSides[getIndex(clockSides, side + 2)][index]) {
        if (clockSides[getIndex(clockSides, side)][index].color == clockSides[getIndex(clockSides, side + 1)][index].color && clockSides[getIndex(clockSides, side + 1)][index].color == clockSides[getIndex(clockSides, side + 2)][index].color) {
            return    0;
        }
    }
    return "false";
}

function scoreCheckVertical(clock, side, index) {
    curSide = clock.blocks[side];
    if (curSide[index] && curSide[index - 2] && curSide[index - 1]) {
        if (curSide[index].color == curSide[index - 2].color && curSide[index - 2].color == curSide[index - 1].color) {
            return -2;
        }
    }

    if (curSide[index] && curSide[index + 1] && curSide[index - 1]) {
        if (curSide[index].color == curSide[index + 1].color && curSide[index + 1].color == curSide[index - 1].color) {
            return -1;
        }
    }

    if (curSide[index] && curSide[index + 2] && curSide[index + 1]) {
        if (curSide[index].color == curSide[index + 2].color && curSide[index + 2].color == curSide[index + 1].color) {
            return 0;
        }
    }
    return "false";
}
function consolidateBlocks(clock, side, index) {
    horizontal = scoreCheckHorizontal(clock, side, index);
    vertical = scoreCheckVertical(clock, side, index);
    deleted = [];
    if (horizontal != "false") {
        scoreScalar *= 2;
        deleted.push([side, index, horizontal]);
    } else {
        deleted.push([]);
    }
    if (vertical != "false") {
        scoreScalar *= 2;
        deleted.push([side, index, vertical]);
    } else {
        deleted.push([]);
    }
    eraseBlocks(clock, deleted);
    return;
}

function eraseBlocks(clock, deleted) {
    if (deleted[0].length > 0) {
        side = deleted[0][0];
        index = deleted[0][1];
        horizontal = deleted[0][2];
        length = 3;
        flag = 0;
        if (clock.blocks[getIndex(clock.blocks, side + horizontal + length + 1)][index]) {
            try {
                flag = clock.blocks[getIndex(clock.blocks, side + horizontal + length)][index].color == clock.blocks[getIndex(clock.blocks, side + horizontal + length + 1)][index].color;
            } catch (e) {
                console.log(e);
            }
        }
        while (flag) {
            if (clock.blocks[getIndex(clock.blocks, side + horizontal + length + 1)][index]) {
                flag = clock.blocks[getIndex(clock.blocks, side + horizontal + length)][index].color == clock.blocks[getIndex(clock.blocks, side + horizontal + length + 1)][index].color;
            }
            length++;
        }
        console.log(length);
        for (var i = 0; i < length; i++) {
            clock.blocks[getIndex(clock.blocks, side + horizontal + i)].splice(index, 1);
        }
        for (var i = 0; i < length; i++) {
            if (side + horizontal + i < clock.blocks.length) {
                consolidateBlocks(clock, getIndex(clock.blocks, side + horizontal + i), index);
            }
        }
    }
    if (deleted[1].length > 0) {
        side = deleted[1][0];
        index = deleted[1][1];
        vertical = deleted[1][2];
        vertlength = 3;
        while (index + vertical + vertlength < clock.blocks[side].length - 1 && (clock.blocks[slide][index + vertical + length].color == clock.blocks[slide][index + vertical + length + 1].color )) {
            vertlength += 1;
        }
        clock.blocks[side].splice(index + vertical, 2 + (1 * (!deleted[0].length > 0)));
        for (var i = 0; i < clock.blocks[side].length - (index + vertical); i++) {
            consolidateBlocks(clock, side, index + vertical + i);
        }
    }
    sidesChanged = [];
    if (deleted[1].length > 0) {
        if (deleted[1][0] != "false") {
            sidesChanged.push(deleted[1][0]);
        }
    }
    if (deleted[0].length > 0) {
        for (var i = 0; i < length; i++) {
            if (deleted[0][2] != "false") {
                sidesChanged.push(getIndex(clock.blocks, deleted[0][0] + deleted[0][2] + i));
            }
        }
    }
    sidesChanged.forEach(function(o) {
        MainClock.blocks[o].forEach(function(block) {
            block.settled = 0;
        })
    });
}
