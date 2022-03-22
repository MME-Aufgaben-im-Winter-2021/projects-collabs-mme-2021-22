import Observable from "../../utils/Observable.js";
import CONFIG from "../../utils/Config.js";

// methods to draw circles on click from: https://stackoverflow.com/questions/20516311/drawing-a-circle-in-a-canvas-on-mouseclick
function getMousePos(canvas, e) {
    let rect = canvas.getBoundingClientRect();
    return {
        x: Math.round((e.clientX - rect.left) * (canvas.width / rect.width)),
        y: Math.round((e.clientY - rect.top) * (canvas.height / rect.height)),
    };
}

class CanvasView extends Observable {
    constructor(container, toolbar) {
        super();
        this.body = container;
        this.canvas = container.getElementsByTagName("canvas")[0];
        this.context = this.canvas.getContext("2d");
        this.x = 0;
        this.y = 0;
        this.body.addEventListener("click", this.draw.bind(this));
        this.toolbar = toolbar;
        this.rectButton = toolbar.querySelector("#rect");
        this.rectButton.addEventListener("click", this.changeStatusRect.bind(this));
        this.arcButton = toolbar.querySelector("#arc");
        this.arcButton.addEventListener("click", this.changeStatusArc.bind(this));

        this.currentTool = "rect";
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
            posX = pos.x,
            posY = pos.y,
            randomColor = CONFIG.COLOR_LIST[Math.floor(Math.random() * CONFIG.COLOR_LIST.length)];
        console.log(this.currentTool);
        if(this.currentTool === undefined){
            this.currentTool = "rect";
        }
        if(this.currentTool === "arc"){ //TODO: implement button in html, check if arc is activated
            context.fillStyle = randomColor;
            context.beginPath();
            context.arc(posX, posY, 2, 0, 2 * Math.PI);
            context.fill();
        } else if(this.currentTool === "rect" && ((this.x === undefined && this.y === undefined) || (this.x === 0 && this.y === 0))){ //TODO: implement button in html, check if rect is activated
            this.x = posX;
            this.y = posY;
        } else if(this.currentTool === "rect" && this.x !== 0 && this.y !== 0){ //TODO: implement button in html, check if rect is activated
            context.lineWidth = "2";
            context.strokeStyle = randomColor;
            context.strokeRect(this.x, this.y, posX - this.x , posY - this.y);
            this.x = 0;
            this.y = 0;
        }
        //TODO: give color code to auto activated comment
    }

    changeStatusRect(){
        this.currentTool = "rect";
    }

    changeStatusArc(){
        this.currentTool = "arc";
        console.log(this.currentTool);
    }
}

export default CanvasView;