import CONFIG from "../../utils/Config.js";
import { Event, Observable } from "../../utils/Observable.js";

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
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.x = 0;
        this.y = 0;
        this.canvas.addEventListener("click", this.draw.bind(this));
        this.rectButton = this.body.querySelector("#r");
        this.rectButton.addEventListener("click", this.changeStatusRect.bind(this));
        this.arcButton = this.body.querySelector("#a");
        this.arcButton.addEventListener("click", this.changeStatusArc.bind(this));

        this.currentTool = "rect";
    }

    //draws circle or rect depending on chosen tool
    //further notifies commentSectionView if something was marked with png and color of marking
    draw(e) {
        let pos = getMousePos(this.canvas, e),
            posX = pos.x,
            posY = pos.y,
            randomColor = CONFIG.COLOR_LIST[Math.floor(Math.random() * CONFIG.COLOR_LIST.length)];
        if (this.currentTool === undefined) {
            this.currentTool = "rect";
        }
        if (this.currentTool === "arc") {
            this.context.fillStyle = randomColor;
            this.context.beginPath();
            this.context.arc(posX, posY, 2, 0, 2 * Math.PI);
            this.context.fill();
            this.notifyAll(new Event("newMarking", {
                color: randomColor,
                canvasPNG: this.getCanvasURL(),
            }));
        } else if (this.currentTool === "rect" && ((this.x === undefined && this.y === undefined) || (this.x === 0 && this.y === 0))) {
            this.x = posX;
            this.y = posY;
        } else if (this.currentTool === "rect" && this.x !== 0 && this.y !== 0) {
            this.context.lineWidth = "2";
            this.context.strokeStyle = randomColor;
            this.context.strokeRect(this.x, this.y, posX - this.x, posY - this.y);
            this.x = 0;
            this.y = 0;
            this.notifyAll(new Event("newMarking", { color: randomColor, canvasPNG: this.getCanvasURL() }));
        }

    }

    //changes tool
    changeStatusRect() {
        this.currentTool = "rect";
    }

    //changes tool
    changeStatusArc() {
        this.currentTool = "arc";
    }

    //returns png/url of current canvas
    getCanvasURL() {
        let dataURL = this.canvas.toDataURL();
        return dataURL;
    }

    //sets canvas according to saved db png
    setCanvasImg(base64Image) {
        var img = new Image();
        img.src = base64Image;
        img.onload = () => {
            this.context.drawImage(img, 0, 0);
        };
    }
}

export default CanvasView;