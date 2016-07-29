//////////////////////////
// p2p class prototype
//////////////////////////
P2P = function (serverKey, 
        eventPeerOpen, eventTriggleConnect, eventEmitConnect, 
        eventReceiveData, eventSendData) {
    this.peer = new Peer({key: serverKey, debug: 3});
    this.localId = undefined;

    this.conns = {};

    //this.conn = undefined;
    //this.remoteId = undefined;
    
    this.eventPeerOpen = eventPeerOpen;
    this.eventTriggleConnect = eventTriggleConnect;
    this.eventEmitConnect = eventEmitConnect;
    this.eventReceiveData = eventReceiveData;
    this.eventSendData = eventSendData;
    
    var P2PObject = this;
    
    // on create local peer
    P2PObject.peer.on('open', function(id) {
        P2PObject.localId = id;
        P2PObject.eventPeerOpen(P2PObject);
    });

    // on receiving a remote peer connection require
    P2PObject.peer.on('connection', function (connection) {
        var conn = connection;
        
        // on connection open
        conn.on('open', function() {
            P2PObject.conns[conn.peer] = conn;
            P2PObject.eventTriggleConnect(P2PObject, conn);
        });
        
        // on receiving data
        conn.on('data', function(data) {
            P2PObject.eventReceiveData(P2PObject, conn, data);
        });
    });
}

P2P.prototype = {
    // on sending a remoite peer connection require
    connect : function (remotePeerId) {
        var conn = this.peer.connect(remotePeerId);
        
        var P2PObject = this;
        
        // on connection open
        conn.on('open', function() {
            P2PObject.conns[conn.peer] = conn;
            P2PObject.eventEmitConnect(this, conn);
        });
        
        // on receiving data
        conn.on('data', function(data) {
            P2PObject.eventReceiveData(P2PObject, conn, data);
        });
    },
    
    // on sending data
    send : function(data) {
        for (remoteId in this.conns) {
            this.conns[remoteId].send(data);
        }
        this.eventSendData(this, data);
    }
};


