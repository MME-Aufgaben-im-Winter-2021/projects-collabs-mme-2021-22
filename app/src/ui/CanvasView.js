import Observable from "../utils/Observable.js";

// function from: https://stackoverflow.com/questions/6150289/how-can-i-convert-an-image-into-base64-string-using-javascript
const toDataURL = url => fetch(url)
    .then(response => response.blob())
    .then(blob => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    }));

function encodeBase64(img) {
    let imgBase64;
    toDataURL(img)
        .then(dataUrl => {
            imgBase64 = dataUrl;
        });
    return imgBase64;
}

function saveImageInDb(canvas, img) {
    const imageBase64 = encodeBase64(img),
        canvasBase64 = canvas.toDataURL();

    // TODO: save constants in database
}

function decodeBase64(src) {
    // TODO: hope this works
    return "data:image/jpeg;base64, LzlqLzRBQ..." + src;
}

// methods to draw circles on click from: https://stackoverflow.com/questions/20516311/drawing-a-circle-in-a-canvas-on-mouseclick
function getMousePos(canvas, e) {
    let rect = canvas.getBoundingClientRect();
    return {
        x: Math.round((e.clientX - rect.left) * (canvas.width / rect.width)),
        y: Math.round((e.clientY - rect.top) * (canvas.height / rect.height)),
    };
}

class CanvasView extends Observable{
    constructor(container){
        super();
        this.body = container;
        this.canvas = container.getElementsByTagName("canvas")[0];
        this.context = this.canvas.getContext("2d");
        document.onclick = this.draw;
    }

    updateImage(src) {
        let img = this.body.getElementsByClassName("screenshot")[0].src;
        saveImageInDb(this.canvas, img);

        this.body.getElementsByClassName("screenshot")[0].src = decodeBase64(src);
        // TODO: replace the canvas with canvas from database
        this.context.rect(0, 0, this.canvas.width, this.canvas.height);
    }

    draw(e) {
        let canv = document.getElementsByTagName("canvas")[0],
            context = canv.getContext("2d"),
            pos = getMousePos(canv, e),
            posx = pos.x,
            posy = pos.y;
        context.fillStyle = "#41cad9";
        context.beginPath();
        context.arc(posx, posy, 2, 0, 2 * Math.PI);
        context.fill();
    }
}

export default CanvasView;