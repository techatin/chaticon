
$(function() {
    //$('.pop-up').hide();
    //$('.pop-up').fadeIn(1000);
    //$('#overlay').removeClass('blur-in');
    //$('#overlay').addClass('blur-out');

    $('.close-button').click(function (e) {
    $('.pop-up').fadeOut(700);
    //$('#overlay').removeClass('blur-in');
    //$('#overlay').addClass('blur-out');
    e.stopPropagation();
    });

    $('.button').click(function (e) {
    $('.pop-up').fadeOut(700);
    //$('#overlay').removeClass('blur-in');
    //$('#overlay').addClass('blur-out');
    e.stopPropagation();
    });
});
