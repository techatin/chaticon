var foundationRoutes = [{"name":"settings","url":"/settings","animationIn":"slideFromLeft","animationOut":"slideFromLeft","path":"templates/settings.html"},{"name":"home","url":"/","path":"templates/home.html"}];

$(document).ready(function() {
    var socket = io.connect('http://techatin.pythonanywhere.com/api');

    $("#create-room").click(function() {
        console.log("hi");
        var room_number;
        var nickname = $('#nickname').val();
        console.log('hi1');

        console.log('hi2');
        $.post('http://techatin.pythonanywhere.com/api/create_room', function(data) {
            var json = JSON.parse(data);
            console.log("Room number is: " + json['room_number'].toString());
            alert("Room number is: " + json['room_number'].toString());
            room_number = json['room_number'];
            socket.emit('join', {"room" : room_number, "username" : nickname}, function() {
                $(document).empty();
                $.get('http://techatin.pythonanywhere.com/chat', function(data) {
                    console.log(data);
                    $('body').html(data);
                    initWebcam();
                    $('.pop-up').hide();
                    socket.emit('get_username');
                    $("#send-message-button").click(function(){
                		var text = $("#send-message-text").val();
                		console.log("Button pressed");
                		console.log(text);
                		if (text !== ""){
                			insertChat(this_user, text);
                			console.log("sending message");
                			socket.emit('message_event', {body: text});
                			$("#send-message-text").val('');
                		}
                	});
                	$("#send-message-text").on("keyup", function(e){
                        if (e.which === 13){
                			$("#send-message-button").click();
                		}
                	});
                    // return ;
                });
            });
            // return;
            console.log('hi');
        });
        /* $('<form>', {
            method: 'post',
            action: '/intermediate'
        }).submit(); */

    });

    $("#enter-room").on("click", function() {
        var room_number = parseInt($("#enter-room-number").val());
        var nickname = $("#nickname").val();

        $('#test').append($('<form/>').attr({
            id: 'hidden_form',
            method: 'POST',
            action: 'intermediate'
        }));
        console.log('hi');
        socket.emit('join', {"room" : room_number, "username" : nickname}, function() {
            $(document).empty();
            $.get('http://techatin.pythonanywhere.com/chat', function(data) {
                console.log(data);
                $('body').html(data);
                initWebcam();
                $('.pop-up').hide();
                socket.emit('get_username');
                $("#send-message-button").click(function(){
            		var text = $("#send-message-text").val();
            		console.log("Button pressed");
            		console.log(text);
            		if (text !== ""){
            			insertChat(this_user, text);
            			console.log("sending message");
            			socket.emit('message_event', {body: text});
            			$("#send-message-text").val('');
            		}
            	});
            	$("#send-message-text").on("keyup", function(e){
            		if (e.which === 13){
            			$("#send-message-button").click();
            		}
            	});
                // return ;
            });
        });
    });

	/* socket.on('hi', function(msg) {
		alert('hi');
	}) */

    socket.on('start_game', function() {

	});

	socket.on('game_over', function() {

	});

	// Server returns this user's username
	socket.on('answer_username', function(msg) {
		this_user = msg.username;
		alert(this_user);
		socket.emit('user_ready');
	});

	// Both users have connected, send winning emotion
	socket.on('start_game', function(msg) {
        console.log(msg);
		console.log('Game is starting');
		winning_emotion = msg.data[this_user];
        alert("Make the other player's emotion " + winning_emotion + "!");

        game_start_time = new Date($.now());
		console.log(game_start_time.getTime());
    });

	socket.on('get_message', function(msg) {
		console.log('message received');
        console.log(msg.other_user);
		if(msg.other_user !== this_user) {
            console.log(msg.other_user);
			insertChat(msg.other_user, msg.text);
		}
	});

    socket.on('game_over',function(msg) {
        alert(msg.winner);
        console.log('game_over received');
        if(msg.winner !== this_user) {
            alert('You lost.');
        }
        else{
            alert('You won.');
            console.log("HALLO");
            console.log("HUAIJIN");
        }
        game_over = true;
    });
});

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
