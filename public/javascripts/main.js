socket = io();

socket.on('game', function (game) {
    $('.content').html(JSON.stringify(game));
});

$(function () {
    var $form = $('<form name="join">');
    $form.append($('<input type="text" name="username" placeholder="username">'));
    $form.append($('<button type="submit">').text('Join Game'));
    $('.content').before($form);

    $form.submit(function (evt) {
        evt.preventDefault();
        var $input = $('input[name=username]', $form)
        socket.emit('join', $input.val());
        $input.val('');
        return false;
    });
});
