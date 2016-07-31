//////////////////////////
// utils
//////////////////////////

var p2p = new P2P('0kl9mk3ed0gj5rk9',
    // on peer open
    function (p2p) {
        $('#local-id').html(p2p.localId);
    },
    // on triggle connection
    function (p2p, conn) {
        print('connection established');
        addCom(conn.peer);
        addPencil(conn.peer);
    },
    // on emit connection
    function (p2p, conn) {
        print('connection established');
        $('#remote-id').val('');
        addCom(conn.peer);
        addPencil(conn.peer);
    },
    // on receive data
    function (p2p, conn, data) {
        print(conn.peer + ': ' + data);
        var message = JSON.parse(data);
        drawCallback(conn, message);
        chatCallback(conn, message);
    },
    // on send data
    function (p2p, data) {
        // $('#send-data').val('');
        print('local(' + p2p.localId + '): ' + data);
    }
);

function connectPeer() {
    var remoteId = $('#remote-id').val();
    p2p.connect(remoteId);
}

function addCom(remoteId) {
    if ($('#connect-list').find('span:contains(' + remoteId + ')').length > 0) return ;
    var newCom = 
    $('<div>\
        <span> >' + remoteId + '</span>\
       </div>');
    newCom.appendTo('#connect-list');
}

//////////////////////////
// web console
//////////////////////////

function print(line) {
    var textarea = document.getElementById("console");
    textarea.value += '> ' + line + '\n'; 
    textarea.scrollTop = textarea.scrollHeight;
}

function clearConsole() {
    document.getElementById("console").value = '';     
}