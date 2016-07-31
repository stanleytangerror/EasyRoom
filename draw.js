Message = function(op, x, y) {
    this.op = op;
    this.x = x;
    this.y = y;
}

Pencil = function(lastX, lastY, curX, curY, lineThickness) {
    this.lastX = lastX;
    this.lastY = lastY;
    this.curX = curX;
    this.curY = curY;
    this.lineThickness = lineThickness;
    this.painting = false;
}

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var myPencil = new Pencil(0, 0, 0, 0, 1);
var theirPencils = {};

canvas.width = canvas.height = 600;
ctx.fillRect(0, 0, 600, 600);

//////////////////////////
// pencil state api
//////////////////////////

function addPencil(remoteId) {
    theirPencils[remoteId] = new Pencil(0, 0, 0, 0, 1);
}

function drawStart(context, pencil, msg) {
    pencil.painting = true;
    context.fillStyle = "#ffffff";
    pencil.lastX = msg.x;
    pencil.lastY = msg.y;
}

function drawEnd(context, pencil) {
    pencil.painting = false;
}

function drawOperate(context, pencil, msg) {
    pencil.curX = msg.x;
    pencil.curY = msg.y;
             
    var x1 = pencil.curX,
        x2 = pencil.lastX,
        y1 = pencil.curY,
        y2 = pencil.lastY;


        var steep = (Math.abs(y2 - y1) > Math.abs(x2 - x1));
        if (steep){
            var x = x1;
            x1 = y1;
            y1 = x;

            var y = y2;
            y2 = x2;
            x2 = y;
        }
        if (x1 > x2) {
            var x = x1;
            x1 = x2;
            x2 = x;

            var y = y1;
            y1 = y2;
            y2 = y;
        }

        var dx = x2 - x1,
            dy = Math.abs(y2 - y1),
            error = 0,
            de = dy / dx,
            yStep = -1,
            y = y1;
        
        if (y1 < y2) {
            yStep = 1;
        }
       
        lineThickness = 5 - Math.sqrt((x2 - x1) *(x2-x1) + (y2 - y1) * (y2-y1))/10;
        if(lineThickness < 1){
            lineThickness = 1;   
        }

        for (var x = x1; x < x2; x++) {
            if (steep) {
                context.fillRect(y, x, lineThickness , lineThickness );
            } else {
                context.fillRect(x, y, lineThickness , lineThickness );
            }
            
            error += de;
            if (error >= 0.5) {
                y += yStep;
                error -= 1.0;
            }
        }

        pencil.lastX = pencil.curX;
        pencil.lastY = pencil.curY;

}

//////////////////////////
// local pencil events
//////////////////////////

canvas.onmousedown = function(e) {
    // painting = true;
    // ctx.fillStyle = "#ffffff";
    // myPencil.lastX = e.pageX - this.offsetLeft;
    // myPencil.lastY = e.pageY - this.offsetTop;
    var msg = new Message('start', e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
    p2p.send(JSON.stringify(msg));
    drawStart(ctx, myPencil, msg);
};

canvas.onmouseup = function(e){
    var msg = new Message('end', e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
    p2p.send(JSON.stringify(msg));
    drawEnd(ctx, myPencil);
}

canvas.onmousemove = function(e) {
    if (!myPencil.painting) return;
    
    var msg = new Message('draw', e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
    p2p.send(JSON.stringify(msg));
    drawOperate(ctx, myPencil, msg);

}

//////////////////////////
// remote pencil events
//////////////////////////

function drawCallback(conn, message) {
    var pencil = theirPencils[conn.peer];
    switch (message.op) {
        case 'draw':
            drawOperate(ctx, pencil, message);
            break;

        case 'start':
            drawStart(ctx, pencil, message);
            break;
            
        case 'end':
            drawEnd(ctx, pencil);
            break;
            
        default:
            break;
    }
}