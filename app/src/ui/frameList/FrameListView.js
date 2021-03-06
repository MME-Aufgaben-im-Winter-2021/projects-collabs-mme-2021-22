/* eslint-env browser */

import { Event, Observable } from "../../utils/Observable.js";
import FrameListElementView from "./FrameListElementView.js";

class FrameListView extends Observable {
    constructor(container) {
        super();
        this.frameList = container.querySelector("ul.frame-list");
    }

    //adds a frame to the framelist
    addFrame(id, title, base64Image) {
        const frameListElement = new FrameListElementView(id, title, base64Image);
        frameListElement.addEventListener("frameListElementClicked", this.onFrameListElementClicked.bind(this));
        this.frameList.appendChild(frameListElement.body);
    }

    //notifies if there is a click on a specific frame
    onFrameListElementClicked(event) {
        this.notifyAll(new Event("frameListElementClicked", { id: event.data.id }));
    }

    //updates frameList so its up to date
    updateElements(frames) {
        this.frameList.innerHTML = "";
        for (const frame of frames) {
            this.addFrame(frame.id, frame.title, frame.imageBase64);
        }
    }

}

export default FrameListView;