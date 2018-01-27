var me = {};
var you = {};

$(document).ready(function(){
	var width = $(window).width();
	var height = $(window).height();
	$(".frame").width(width / 2);
	$(".frame").height(height);
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
    
    if (who == "me"){
        control = '<h4>You</h4>' +
					'<p>' + text + '</p>' + 
					'<hr />'            
    }
    else{
        control = '<h4>Not You</h4>' +
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
