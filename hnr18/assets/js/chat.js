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

//-- No use time. It is a javaScript effect.
function insertChat(who, text, time = 0){
    var control = "";
    
    if (who == this_user) {
        control = '<div class="message-me>' +
                        '<h4>' + this_user + '</h4>' +
						'<p>' + text + '</p>' +
			        '</div>';
    }
    
    else {
        control = '<div class="message-other">' +
                        '<h4>' + other_user + '</h4>' +
					    '<p>' + text + '</p>' +
				    '</div>';
    }
    
    setTimeout(
        function(){                        
            $("#message-display").append(control);
        }, time);
    }
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
