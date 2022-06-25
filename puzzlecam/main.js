let VIDEO;
let CONTEXT;
let CANVAS;
let PIECES = [];
let SCALAR = 0.6;
let SIZE = {x: 0, y: 0, width: 0, height: 0, columns: 3, rows: 3};
let SELECTED_PIECE = null;


function main() {
    CANVAS = document.getElementById("myCanvas");
    CONTEXT = CANVAS.getContext("2d");
    addEventListeners();
    navigator.mediaDevices.getUserMedia(
        {
            audio: true,
            video: {
                width: {ideal: 200},
                height: {ideal: 400}
            }
        }
    ).then(signal => {
        VIDEO = document.createElement("video")
        VIDEO.srcObject = signal;
        VIDEO.play();

        VIDEO.onloadeddata = () => {
            handleResize();
            window.addEventListener("resize", handleResize);
            initializePieces(4, 5);
            updateCanvas();
        }
    }).catch(error => {
        alert("Camera error " + error);
    });

}

function addEventListeners() {
    CANVAS.addEventListener("mousedown", onMouseDown);
    CANVAS.addEventListener("mousemove", onMouseMove);
    CANVAS.addEventListener("mouseup", onMouseUp);

    CANVAS.addEventListener("touchstart", onTouchStart);
    CANVAS.addEventListener("touchmove", onTouchMove);
    CANVAS.addEventListener("touchend", onTouchEnd);
}

function onMouseDown(evt) {
    SELECTED_PIECE = getPressedPiece(evt)

    if (SELECTED_PIECE != null) {
        const ind = PIECES.indexOf(SELECTED_PIECE);
        if (ind > -1) {
            PIECES.splice(ind, 1);
            PIECES.push(SELECTED_PIECE);
        }
        SELECTED_PIECE.offset = {
            x: evt.x - SELECTED_PIECE.x,
            y: evt.y - SELECTED_PIECE.y
        }
    }
}

function onMouseMove(evt) {
    if (SELECTED_PIECE != null) {
        SELECTED_PIECE.x = evt.x - SELECTED_PIECE.offset.x;
        SELECTED_PIECE.y = evt.y - SELECTED_PIECE.offset.y;
    }
}


function onMouseUp() {
    if (SELECTED_PIECE != null) {
        if (SELECTED_PIECE.isClose()) {
            SELECTED_PIECE.snap();
        }
    }
    SELECTED_PIECE = null;
}


function onTouchStart(evt){
    let loc = {
        x:evt.touches[0].clientX,
        y:evt.touches[0].clientY
    };
    onMouseDown(loc);
}

function onTouchMove(evt){
    let loc = {
        x:evt.touches[0].clientX,
        y:evt.touches[0].clientY
    };
    onMouseMove(loc);
}

function onTouchEnd(){
    onMouseUp();
}

function getPressedPiece(loc) {
    let reversedOrder = [...PIECES].reverse()
    for (let p of reversedOrder) {
        if (loc.x > p.x && loc.x < p.x + p.width && loc.y > p.y && loc.y < p.y + p.height && p.selectable) {
            return p;
        }
    }
    return null;
}


function handleResize() {
    CANVAS.width = window.innerWidth;
    CANVAS.height = window.innerHeight;

    let resizer = SCALAR * (
        Math.min(
            window.innerWidth / VIDEO.videoWidth,
            window.innerHeight / VIDEO.videoHeight
        )
    );

    SIZE.width = resizer * VIDEO.videoWidth;
    SIZE.height = resizer * VIDEO.videoHeight;
    SIZE.x = window.innerWidth / 2 - SIZE.width / 2;
    SIZE.y = window.innerHeight / 2 - SIZE.height / 2;
}

function updateCanvas() {

    CONTEXT.clearRect(0, 0, CANVAS.width, CANVAS.height)

    CONTEXT.globalAlpha = 0.5;

    CONTEXT.drawImage(VIDEO,
        SIZE.x, SIZE.y,
        SIZE.width, SIZE.height);

    CONTEXT.globalAlpha = 1;


    drawPieces();

    window.requestAnimationFrame(updateCanvas);
}

function drawPieces() {
    let correctLocPieces = PIECES.filter(el => el.x == el.xCorrect && el.y == el.yCorrect);
    let incorrectLocPieces = PIECES.filter(el => (el.x == el.xCorrect && el.y == el.yCorrect) == false);
    for (let p of correctLocPieces) {
        p.draw(CONTEXT);
    }
    for (let p of incorrectLocPieces) {
        p.draw(CONTEXT);
    }
}

function initializePieces(rows, columns) {
    SIZE.rows = rows;
    SIZE.columns = columns;
    PIECES = [];
    for (let i = 0; i < SIZE.rows; i++) {
        for (let j = 0; j < SIZE.columns; j++) {
            PIECES.push(new Piece(i, j));
        }
    }
    console.log(PIECES);
}

class Piece {
    constructor(rowInd, colInd) {
        this.rowInd = rowInd;
        this.colInd = colInd;
        this.x = SIZE.x + SIZE.width * this.colInd / SIZE.columns;
        this.y = SIZE.y + SIZE.height * this.rowInd / SIZE.rows;
        this.width = SIZE.width / SIZE.columns;
        this.height = SIZE.height / SIZE.rows;
        this.xCorrect = this.x;
        this.yCorrect = this.y;
        this.selectable = false;
    }

    draw(context) {
        context.beginPath();
        context.drawImage(VIDEO,
            this.colInd * VIDEO.videoWidth / SIZE.columns,
            this.rowInd * VIDEO.videoHeight / SIZE.rows,
            VIDEO.videoWidth / SIZE.columns,
            VIDEO.videoHeight / SIZE.rows,
            this.x,
            this.y,
            this.width,
            this.height
        );
        context.rect(this.x, this.y, this.width, this.height)
        context.stroke();
    }

    isClose() {
        if (distance({x: this.x, y: this.y}, {x: this.xCorrect, y: this.yCorrect}) < this.width / 3) {
            return true;
        }
        return false;
    }

    snap() {
        this.x = this.xCorrect;
        this.y = this.yCorrect;
        this.selectable = false;
    }
}

function randomizePieces() {
    for (let i = 0; i < PIECES.length; i++) {
        let loc = {
            x: Math.random() * (CANVAS.width - PIECES[i].width),
            y: Math.random() * (CANVAS.height - PIECES[i].height),
        };
        PIECES[i].x = loc.x;
        PIECES[i].y = loc.y;
        PIECES[i].selectable = true;
    }
}

function distance(p1, p2) {
    return Math.sqrt(
        (p1.x - p2.x) * (p1.x - p2.x) +
        (p1.y - p2.y) * (p1.y - p2.y)
    );
}