var foundationRoutes = [{"name":"settings","url":"/settings","animationIn":"slideFromLeft","animationOut":"slideFromLeft","path":"templates/settings.html"},{"name":"home","url":"/","path":"templates/home.html"}];

$(document).ready(function() {
    $("#create-room").click(function() {
        console.log("hi");
        var room_number;
        $.post('http://localhost:5000/api/create_room', function(data) {
            var json = JSON.parse(data);
            console.log("Room number is: " + json['room_number'].toString());
            alert("Room number is: " + json['room_number'].toString());
            room_number = json['room_number'];
            // return;
        });

    });

    $("#enter-room").on("click", function() {
        return;
    });
});
