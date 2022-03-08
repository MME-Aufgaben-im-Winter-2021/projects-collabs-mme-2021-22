/* eslint-env browser */

import { Event, Observable } from "../../utils/Observable.js";
import createElementFromHTML from "../../utils/Utilities.js";
import FrameListElementView from "./FrameListElementView.js";

class FrameListView extends Observable {
    constructor(container) {
        super();
        this.frameList = container.querySelector("ul.frame-list");
        this.addFrame(); // TODO: Just for debugging, remove before actual use.
    }

    addFrame(id, title, base64Image) {
        const frameListElement = new FrameListElementView(id, title, base64Image);
        this.frameList.appendChild(frameListElement.body);
    }
}

export default FrameListView;