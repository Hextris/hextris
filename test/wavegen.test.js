//Testing blocksDestroyed() within wavegen.js
const {blockDestroyed, waveGen} = require('../js/wavegen.js')
const {mainInit, scaleCanvas} = require('../js/main.js')
const initialize = require('../js/initialization.js')
const Hex = require('../js/Hex.js')

test('Testing nextgen and difficulty in wavegen', () => {
  //Create arrays of test values to test with nextGen and difficulty
  
  var ng_vals = [0, 300, 600, 601, 900, 1349, 1350, 1351, 1000];
  var diff_vals = [0, 34 ,35, 36, 1000];
  
  //Generate new hex object to create a new wave object to test
  //blockDestroyed()
  newHex = new Hex(settings.hexWidth);
  testWave = new waveGen(newHex);

  //Testing nextgen setting
  for (var i = 0; i < ng_vals.length;  i++){
    //Set array values as the nextGen parameter. This is the parameter we want to test
    testWave.nextGen = ng_vals[i];
    //Results set to a sample run of blockDestroyed;
    if (i > 6) {
          expect(blockDestroyed(testWave)).toBe(30 * settings.creationSpeedModifer)
     } else if (i > 3) {
        expect(blockDestroyed(testWave)).toBe(8 * settings.creationSpeedModifer)
     } else {
       expect(blockDestroyed(testWave)).toBe(600);
     }
  }
  
  //Testing difficulty
  for (var j = 0; j < diff_vals.length; j++){
    testWave.difficulty = diff_vals[j];
    if (j > 3){
    expect(blockDestroyed(testWave).toBe(0.085 * settings.speedModifer));
    }
    else {
      expect(blockDestroyed(testWave).toBe(35));
    }
  }

});

