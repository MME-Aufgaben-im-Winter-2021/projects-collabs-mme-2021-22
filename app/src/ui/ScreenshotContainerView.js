/* eslint-env browser */

import {Event, Observable} from "../utils/Observable.js";

class ScreenshotContainerView extends Observable {
    constructor() {
        super();
        this.imageBody = document.querySelector(".screenshot-container .website-picture");
    }
}

export default ScreenshotContainerView;