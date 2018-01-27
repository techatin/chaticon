var this_user;
var other_user;
var winning_emotion;

$(document).ready(function(){
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

//-- No use time. It is a javaScript effect.
function insertChat(who, text, time = 0){
    var control = "";
    var date = formatAMPM(new Date());
    
    if (who == this_user) {
        control = '<div class="message-me>' +
                        '<h4>You</h4>' +
					    '<div>' +
						    '<p style="float:left">' + text + '</p>' +
						    '<p style="float:right"><small>' + date + '</small></p>' +
					    '</div>' +
					    '<hr>' +
			        '</div>';
    }
    
    else {
        control = '<div class="message-other">' +
                        '<h4>Not You</h4>' +
					    '<div>' +
						    '<p style="float:left">' + text + '</p>' +
						    '<p style="float:right"><small>' + date + '</small></p>' +
					    '</div>' +
					    '<hr>' +
				    '</div>';
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
	});
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
