// connect to the socket server
var socket = io.connect();

$(function () {
    $('form[name=login]').submit(function (evt) {
        evt.preventDefault();
        socket.emit('join', $('input[name=username]').val());
        return false;
    });
});
