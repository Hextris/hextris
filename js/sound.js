var audioCtx;
var bufferLoader;
var sourceList = new Array();
var gainNodeList = new Array();
var webAudioSupported= true;
$(document).ready( function() {
	audioCtx = new (window.AudioContext || window.webkitAudioContext)();
	if(!audioCtx) {
		webAudioSupported=false;
	}
	else {
		bufferLoader = new BufferLoader(
			audioCtx,
			[
			"sounds/ville_seppanen-1_g.mp3",
			"sounds/button1.mp3",
			"sounds/complete.mp3",
			],
			loadComplete
			);
		bufferLoader.load();
	}
});
function playOneShot(AudioBuffer,volume,playbackRate) {
	var sourceCpy = audioCtx.createBufferSource();
	sourceCpy.buffer = AudioBuffer;
  sourceCpy.playbackRate.value = playbackRate;
  var gainCpy = audioCtx.createGain();
  gainCpy.gain.value = volume;
	sourceCpy.connect(gainCpy);
  gainCpy.connect(audioCtx.destination);
	sourceCpy.start(0);
}
function playRotationSound(){
	if(webAudioSupported) {
  	playOneShot(sourceList[1].buffer,1.0,1.0);
	}
}
function playCompletionSound(playbackRate){
	if(webAudioSupported) {
  	playOneShot(sourceList[2].buffer,0.3,playbackRate);
	}
}

function playBackgroundMusic() {
	if(webAudioSupported) {

		gainNodeList[0].gain.value = 0.4;
	}
}
function muteBackgroundMusic() {
	if(webAudioSupported) {
  	gainNodeList[0].gain.value = 0.0;
	}
}
function loadComplete(bufferList) {
	for(var i = 0; i < bufferList.length; i++) {
		var source = audioCtx.createBufferSource();
		source.buffer = bufferList[i];
		var gainNode = audioCtx.createGain();
		source.connect(gainNode);
		gainNode.connect(audioCtx.destination);

		if(i==0) {
			source.loop = true;
			gainNode.gain.value = 0.4;
			source.start(0);
		}

		sourceList[i] = source;
		gainNodeList[i] = gainNode;
	}
}
