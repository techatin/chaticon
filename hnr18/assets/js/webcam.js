navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

var video;
var webcamStream;

var arrhappy = [];

function startWebcam(){
	if (navigator.getUserMedia){
		navigator.getUserMedia(
			//constraints
			{
				video: true,
				audio: false
			},
			
			//successCallback
			function(localMediaStream){
				video = document.querySelector('video')
				video.src = window.URL.createObjectURL(localMediaStream);
				webcamStream = localMediaStream;
				console.log("HELLO IN START WEBCAM");
				myVar = setInterval(snapshot, 5000);
			},
			
			//errorCallback
			function(err){
				console.log("The following error occured: "+err);
			}
		);
	} else {
		console.log("getUserMedia not supported");
	}
}

function stopWebcam(){
	webcamStream.stop();
}

//This code takes a snapshot
var canvas, ctx;
function init(){
	//Get the canvas and obtain a context for drawing in it
	canvas = document.getElementById("myCanvas");
	ctx = canvas.getContext('2d');
	startWebcam();
}

function saveBase64AsFile(base64, fileName) {

    var link = document.createElement("a");

    link.setAttribute("href", base64);
    link.setAttribute("download", fileName);
    link.click();
}

function snapshot(){
	//Draws current image from the video element into the canvas
	ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
	var dataURL = canvas.toDataURL();
	console.log(dataURL);
	//saveBase64AsFile(dataURL, "sample.jpg");
	console.log("Image saved");
	getemo(dataURL);
}

makeblob = function (dataURL) {
	var BASE64_MARKER = ';base64,';
	if (dataURL.indexOf(BASE64_MARKER) == -1) {
		var parts = dataURL.split(',');
		var contentType = parts[0].split(':')[1];
		var raw = decodeURIComponent(parts[1]);
		return new Blob([raw], { type: contentType });
	}
	var parts = dataURL.split(BASE64_MARKER);
	var contentType = parts[0].split(':')[1];
	var raw = window.atob(parts[1]);
	var rawLength = raw.length;

	var uInt8Array = new Uint8Array(rawLength);

	for (var i = 0; i < rawLength; ++i) {
		uInt8Array[i] = raw.charCodeAt(i);
	}

	return new Blob([uInt8Array], { type: contentType });
}

function getemo(imageurl) {
	// No query string parameters for this API call.
	var params = { };
	//console.log("HERE");
	//var datadata = '{"url":"'.concat(imageurl.concat('"}'));
	//console.log(datadata);
	
	bl = makeblob(imageurl);
	console.log(bl);
	$.ajax({
		// NOTE: You must use the same location in your REST call as you used to obtain your subscription keys.
		//   For example, if you obtained your subscription keys from westcentralus, replace "westus" in the 
		//   URL below with "westcentralus".
		url: "https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize?" + $.param(params),
		beforeSend: function(xhrObj){
			// Request headers, also supports "application/octet-stream"
			// xhrObj.setRequestHeader("Content-Type","application/json");
			 xhrObj.setRequestHeader("Content-Type","application/octet-stream");

			// NOTE: Replace the "Ocp-Apim-Subscription-Key" value with a valid subscription key.
			xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","6d431fe462764d768bbb7b857150df54");
		},
		type: "POST",
		// Request body
		//data: '{"url": "file:///C:/Jianzhi%20Home/Programming/chaticon/sandbox/gug.jpg"}',
		//data: '{"url": "http://dianasuemi.com/wp-content/uploads/2017/08/QwupPdD.png"}',
		data: bl,
		
		processData: false,
		contentType: 'application/octet-stream',
		// contentType: 'application/json',
		
		//data: datadata,
		//success: function(){
		//	console.log("DONE!");
		//}
		//data: '{"url": "' + imageurl + '"}',
	}).done(function(data) {
		// Get face rectangle dimensions
		console.log(data);
		/*var faceRectangle = data[0].faceRectangle;
		var faceRectangleList = $('#faceRectangle');

		// Append to DOM
		for (var prop in faceRectangle) {
			faceRectangleList.append("<li> " + prop + ": " + faceRectangle[prop] + "</li>");
		}*/

		// Get emotion confidence scores
		var scores = data[0].scores;
		var scoresList = $('#scores');

		scoresList.html("");

		// Append to DOM
		for(var prop in scores) {
			scoresList.append("<li> " + prop + ": " + scores[prop] + "</li>")
			if (prop == "happiness"){
				arrhappy.push(scores[prop]);
				while (arrhappy.length>30){
					arrhappy.splice(0,1);
				}
			}
		}
		console.log(arrhappy);
	}).fail(function(err) {
		alert("Error: " + JSON.stringify(err));
	});
}
