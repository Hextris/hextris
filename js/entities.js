// HackExeter
//you can change these to sexier stuff
function Block(lane, color, distFromHex, settled) {
    this.settled = (settled == undefined) ? 0 : 1;
    this.height = 20;
    this.width = 65;
    this.lane = lane;
    this.angle = 90 - (30 + 60 * lane);
    if (this.angle < 0) {
        this.angle += 360;
    }

    this.color = color;

    if (distFromHex) {
        this.distFromHex = distFromHex;
    } else {
        this.distFromHex = 300;
    }

    this.draw = function() {
        this.width = 2 * this.distFromHex / Math.sqrt(3);
        this.widthswag = this.width + this.height + 3;

        var p1 = rotatePoint(-this.width / 2, this.height / 2, this.angle);
        var p2 = rotatePoint(this.width / 2, this.height / 2, this.angle);
        var p3 = rotatePoint(this.widthswag / 2, -this.height / 2, this.angle);
        var p4 = rotatePoint(-this.widthswag / 2, -this.height / 2, this.angle);

        ctx.fillStyle = this.color;
        var baseX = canvas.width / 2 + Math.sin((this.angle) * (Math.PI / 180)) * (this.distFromHex + this.height / 2);
        var baseY = canvas.height / 2 - Math.cos((this.angle) * (Math.PI / 180)) * (this.distFromHex + this.height / 2);

        ctx.beginPath();
        ctx.moveTo(baseX + p1.x, baseY + p1.y);
        ctx.lineTo(baseX + p2.x, baseY + p2.y);
        ctx.lineTo(baseX + p3.x, baseY + p3.y);
        ctx.lineTo(baseX + p4.x, baseY + p4.y);
        ctx.lineTo(baseX + p1.x, baseY + p1.y);
        ctx.closePath();
        ctx.fill();
    };

}

function Clock(sideLength) {
    this.fillColor = '#2c3e50';
    this.position = 0;
    this.sides = 6;
    this.blocks = [];
    this.angle = 30;
    this.sideLength = sideLength;
    this.strokeColor = 'blue';
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;

    for (var i = 0; i < this.sides; i++) {
        this.blocks.push([]);
    }

    this.addBlock = function(block) {
        block.settled = 1;
        var lane = this.sides - block.lane;//  -this.position;
        lane += this.position;
        while (lane < 0) {
            lane += this.sides;
        }
        lane = lane % this.sides;
        block.distFromHex = MainClock.sideLength / 2 * Math.sqrt(3) + block.height * this.blocks[lane].length;
        this.blocks[lane].push(block);
        consolidateBlocks(this, lane, this.blocks[lane].length - 1);
    };

    this.doesBlockCollide = function(block, iter, position, tArr) {
        if (block.settled) {
            return;
        }

        var lane = this.sides - block.lane;//  -this.position;
        lane += this.position;

        while (lane < 0) {
            lane += this.sides;
        }
        lane = lane % this.sides;
        var arr = this.blocks[lane];

        if (position !== undefined) {
            arr = tArr;
            if (position <= 0) {
                if (block.distFromHex - (this.sideLength / 2) * Math.sqrt(3) <= 0) {
                    block.settled = 1;
                    if (iter == 2 && block.distFromHex + 1 - (this.sideLength / 2) * Math.sqrt(3) <= 0) {
                        block.distFromHex--;
                    }
                }
            } else {
                if (block.distFromHex + iter - arr[position - 1].distFromHex - arr[position - 1].height <= 0) {
                    block.settled = 1;
                    if (iter == 2 && block.distFromHex + 1 + iter - arr[position - 1].distFromHex - arr[position - 1].height <= 0) {
                        block.distFromHex--;
                    }
                }
            }
        } else {
            if (arr.length > 0) {
                if (block.distFromHex + iter - arr[arr.length - 1].distFromHex - arr[arr.length - 1].height <= 0) {
                    if (iter == 2 && block.distFromHex + iter + 1 - arr[arr.length - 1].distFromHex - arr[arr.length - 1].height <= 0) {
                        block.distFromHex--;
                    }
                    this.addBlock(block);
                }
            } else {
                if (block.distFromHex + iter - (this.sideLength / 2) * Math.sqrt(3) <= 0) {
                    if (iter == 2 && block.distFromHex + iter + 1 - (this.sideLength / 2) * Math.sqrt(3) <= 0) {
                        block.distFromHex--;
                    }
                    this.addBlock(block);
                }
            }
        }
    };

    this.rotate = function(steps) {
        this.position += steps;
        while (this.position < 0) {
            this.position += 6;
        }

        this.position = this.position % this.sides;
        this.blocks.forEach(function(blocks) {
            blocks.forEach(function(block) {
                block.angle = block.angle - steps * 60;
            });
        });

        this.angle = this.angle + steps * 60;
    };

    this.draw = function() {
        drawPolygon(this.x, this.y, this.sides, this.sideLength, this.angle, this.fillColor);
    };
}
