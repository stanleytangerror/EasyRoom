//////////////////////////
// utils
//////////////////////////

var p2plist = [];

// function sendData() {
//     var data = $('#send-data').val();
//     p2plist.forEach(function (i, p2p) {
//         p2p.send(data);
//     });
// }

function connectPeer(com) {
    var remoteid = com.parent().find('[name=remote-id]').val();
    var connNo = com.parent().find('[name=connect-id]').val();
    var p2p = p2plist[connNo];
    p2p.connect(remoteid);
}

function newConnection(com) {
    var p2p = new P2P('0kl9mk3ed0gj5rk9', 
        function(p2p) {
            com.find('[name=local-id]').val(p2p.localId);
        },
        function(p2p) {
            print('connection established');
            com.find('[name=remote-id]').val(p2p.remoteId);        
        },
        function() {
            print('connection established');
        },
        function(p2p, data) {
            print(p2p.remoteId + ': ' + data);
            drawCallback(data);        
        },
        function(p2p, data) { 
            // $('#send-data').val('');
            // print('local(' + p2p.localId + '): ' + data);
        }    
    );
    
    p2plist.push(p2p);
}

function addCom() {
    var count = $('#p2p-list > div').length;
    var newCom = 
    $('<div>\
        <input name="local-id" type="text" />\
        <input name="remote-id" type="text" />\
        <input name="connect-id" type="hidden" val="' + count + '"/>\
        <button name="connect-button" type="button" onclick="connectPeer($(this))">connect</button>\
       </div>');
    newCom.appendTo('#p2p-list');
    
    newConnection(newCom);
    
}

addCom();

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