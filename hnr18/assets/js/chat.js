var this_user = "default_this_user";
var other_user = "default_other_user";
var winning_emotion;

$(document).ready(function(){
	// Connect to socket
	var socket = io.connect('http://techatin.pythonanywhere.com/api');
	socket.emit('get_username');

	// Server returns this user's username
	socket.on('answer_username', function(msg) {
		this_user = msg.username;
		alert(this_user);
		socket.emit('user_ready');
	});

	// Both users have connected, send winning emotion
	socket.on('start_game', function(msg) {
		winning_emotion = msg.data[this_user];
	});

	socket.on('message', function(msg) {
		insertChat(msg.other_user, msg.text);
	});

	$("#send-message-button").on("click", function(){
		var text = $("#send-message-text").val();
		console.log("Button pressed");
		console.log(text);
		if (text !== ""){
			insertChat(this_user, text);
			$("#send-message-text").val('');
		}
	});
	$("#send-message-text").on("keyup", function(e){
		if (e.which === 13){
			var text = $(this).val();
			if (text !== ""){
				insertChat(this_user, text);
				$(this).val('');
			}
		}
	});
});

//-- No use time. It is a javaScript effect.
function insertChat(who, text, time = 0){
    var control = "";

    if (who === this_user) {
        control = '<div class="message-me">' +
                        '<h4>' + this_user + '</h4>' +
						'<p>' + text + '</p>' +
			        '</div>';
    } else {
        control = '<div class="message-other">' +
                        '<h4>' + who + '</h4>' +
					    '<p>' + text + '</p>' +
				    '</div>';
    }

	console.log(who);
	console.log(text);

    setTimeout(
        function(){
            $("#message-display").append(control);
        }, time);
}

//-- NOTE: No use time on insertChat.
insertChat("me", "Lorem", 0);
insertChat("you", "Ipsum", 1500);
insertChat("me", "Dolor", 3500);
insertChat("you", "Sit", 7000);
