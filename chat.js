function chatCallback(conn, message) {
    switch (message.op) {
        case 'chat':
            var chatroom = $('#chat-room')[0];
            chatroom.value += conn.peer + ': ' + message.content + '\n';
            break;

        default:
            break;
    }
}

function sendChat() {
    var ctt = $('#chat-send').val();
    var msg = {op: 'chat', content:$('#chat-send').val()};
    p2p.send(JSON.stringify(msg));
    $('#chat-send').val('');
    $('#chat-room')[0].value += 'Me: ' + ctt + '\n';
}