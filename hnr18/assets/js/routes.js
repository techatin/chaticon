var foundationRoutes = [{"name":"settings","url":"/settings","animationIn":"slideFromLeft","animationOut":"slideFromLeft","path":"templates/settings.html"},{"name":"home","url":"/","path":"templates/home.html"}]; 

$(document).ready(function() {
    $("#create-room").on("click", function() {
        $.post('http://techatin.pythonanywhere.com/api/create_room', function(data) {
            var json = JSON.parse(data);
            console.log(json['room_number']);
            return;
        });
    });
    
    $("#enter-room").on("click", function() {
        return;
    });
});