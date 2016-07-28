//////////////////////////
// p2p class prototype
//////////////////////////
P2P = function (serverKey, 
        eventPeerOpen, eventTriggleConnect, eventEmitConnect, 
        eventReceiveData, eventSendData) {
    this.peer = new Peer({key: serverKey, debug: 3});
    this.conn = undefined;
    this.localId = undefined;
    this.remoteId = undefined;
    
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
        P2PObject.conn = connection;
        
        // on connection open
        P2PObject.conn.on('open', function() {
            P2PObject.remoteId = P2PObject.conn.peer;
            P2PObject.eventTriggleConnect(P2PObject);
        });
        
        // on receiving data
        P2PObject.conn.on('data', function(data) {
            P2PObject.eventReceiveData(P2PObject, data);
        });
    });
}

P2P.prototype = {
    // on sending a remoite peer connection require
    connect : function (remotePeerId) {
        this.conn = this.peer.connect(remotePeerId);
        
        var P2PObject = this;
        
        // on connection open
        this.conn.on('open', function() {
            P2PObject.remoteId = P2PObject.conn.peer;
            P2PObject.eventEmitConnect(this);
        });
        
        // on receiving data
        this.conn.on('data', function(data) {
            P2PObject.eventReceiveData(P2PObject, data);
        });
    },
    
    // on sending data
    send : function(data) {
        this.conn.send(data);
        this.eventSendData(this, data);
    }
};


