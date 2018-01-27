var this_user;
var other_user;
var winning_emotion;

$(document).ready(function(){
	// Resize window
	var width = $(window).width();
	var height = $(window).height();
	$(".frame").width(width / 2);
	$(".frame").height(height);
	
	// Connect to socket
	var socket = io.connect('http://techatin.pythonanywhere.com/api');
	socket.emit('get_username');
	
	// Server returns this user's username
	socket.on('answer_username', function(msg) {
		this_user = msg.username;
		socket.emit('user_ready');
	});
	
	// Both users have connected, send winning emotion
	socket.on('start_game', function(msg) {
		winning_emotion = msg.data[this_user];
	});
	
	socket.on('message', function(msg) {
		insertChat(msg.other_user, msg.text);
	});
});

// Formats the date as HH:MM (12 hour format)
function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}            

// No use time. It is a javaScript effect.
function insertChat(who, text, time = 0){
    var control = "";
    var date = formatAMPM(new Date());
    
    if (who == this_user) {
        control = '<h4>' + this_user + '</h4>' +
					'<p>' + text + '</p>' + 
					'<hr />'            
    }
    else {
        control = '<h4>' + who + '</h4>' +
					'<p>' + text + '</p>' + 
					'<hr />'
    }
    setTimeout(
        function(){                        
            $(".message-display").append(control);
        }, time);
    
}

$(document).ready(function(){
	$("#message-send-button").on("click", function(){
		var text = $("#message-send-text").val();
		if (text !== ""){
			insertChat("me", text);              
			$("#message-send-text").val('');
		}
		
		//Emit message to server
		socket.emit('message', {by: $('#username_data').val(), room: $('#room_name').val(), body: $('#room_data').val()});
		
	});
	
	// Send button
	$("#message-send-text").on("keyup", function(e){
		if (e.which == 13){
			var text = $(this).val();
			if (text !== ""){
				insertChat("me", text);              
				$(this).val('');
			}
		}
	});
});

//-- NOTE: No use time on insertChat.
insertChat("me", "Lorem", 0);  
insertChat("you", "Ipsum", 1500);
insertChat("me", "Dolor", 3500);
insertChat("you", "Sit", 7000);
