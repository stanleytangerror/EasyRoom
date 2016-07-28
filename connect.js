// Create a new Peer with our demo API key, with debug set to true so we can
// see what's going on.
var peer = new Peer({
    key: '0kl9mk3ed0gj5rk9',
    debug: 3
});

// The `open` event signifies that the Peer is ready to connect with other
// Peers and, if we didn't provide the Peer with an ID, that an ID has been
// assigned by the server.
peer.on('open', function(id) {
    $('#local-id').val(id);
});

    // Emitted when a new data connection is established from a remote peer.
peer.on('connection', function (connection) {
    conn = connection;
    initDataConnection(conn);
});

var conn;

function initDataConnection(connection) {
    connection.on('open', function() {
        print('connection established');
        $('#remote-id').val(connection.peer);
    });
    // Receive messages
    connection.on('data', function(data) {
        print('receive: ' + data);
        drawCallback(data);
    });
}

//////////////////////////
// start connection
//////////////////////////

function startConnect() {
    conn = peer.connect($('#remote-id').val());
    
    initDataConnection(conn);
}

function sendData(data) {
    send($('#send-data').val()); 
    $('#send-data').val('');
}

function send(data) {
    conn.send(data);
    print('send: ' + data)
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