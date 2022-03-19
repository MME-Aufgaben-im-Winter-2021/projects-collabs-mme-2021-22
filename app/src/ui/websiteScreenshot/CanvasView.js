import Observable from "../../utils/Observable.js";

// methods to draw circles on click from: https://stackoverflow.com/questions/20516311/drawing-a-circle-in-a-canvas-on-mouseclick
function getMousePos(canvas, e) {
    let rect = canvas.getBoundingClientRect();
    return {
        x: Math.round((e.clientX - rect.left) * (canvas.width / rect.width)),
        y: Math.round((e.clientY - rect.top) * (canvas.height / rect.height)),
    };
}

class CanvasView extends Observable {
    constructor(container) {
        super();
        this.body = container;
        this.canvas = container.getElementsByTagName("canvas")[0];
        this.context = this.canvas.getContext("2d");
        this.body.onclick = this.draw;
    }

    updateCanvasContent(src) {
        let img = this.body.getElementsByClassName("screenshot")[0].src;
        // TODO: save image
        // TODO: replace the canvas with canvas from database
        console.log(src, img);
        this.context.rect(0, 0, this.canvas.width, this.canvas.height);
    }

    draw(e) {
        let canv = document.getElementsByTagName("canvas")[0],
            context = canv.getContext("2d"),
            pos = getMousePos(canv, e),
            posx = pos.x,
            posy = pos.y;
        context.fillStyle = "#41cad9"; // TODO: in config auslagern
        context.beginPath();
        context.arc(posx, posy, 2, 0, 2 * Math.PI);
        context.fill();
    }
}

export default CanvasView;