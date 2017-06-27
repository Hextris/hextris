function BufferLoader(context,urlList,callback) {
	this.context = context;
	this.urlList = urlList;
	this.onload = callback;
	this.bufferList = new Array();
	this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url,index) {
	var request = new XMLHttpRequest();
	request.open("GET",url,true);
	request.responseType = "arraybuffer";

	var loader = this;
	request.onload= function() {
			loader.context.decodeAudioData(request.response, function(buffer) {

			if(!buffer){
				console.log("error decoding"+url);
				alert('Error decoding: '+url);
				return;
			}
			loader.bufferList[index]= buffer;
			if(++loader.loadCount == loader.urlList.length)
				loader.onload(loader.bufferList);
		}
		);
	};

	request.onerror = function() {
		console.log("XMLHttpRequest error");
		alert('BufferLoader: XMLHttpRequest error');
	}
	request.ontimeout = function () {
		console.log("XMLHttpRequest timeout");
	}
	request.onreadystatechange = function() {
		if(request.readyState ==4 && request.status == 200){

		}
	}
	request.send();
}

BufferLoader.prototype.load = function() {
	for(var i = 0; i < this.urlList.length; i++){
		this.loadBuffer(this.urlList[i],i);
	}
}
