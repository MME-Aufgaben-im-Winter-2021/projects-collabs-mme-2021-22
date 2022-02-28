/* eslint-env browser */

import {Event, Observable} from "../utils/Observable.js";

class ScreenshotContainerView extends Observable {
    constructor(container) {
        super();
        this.body = container.querySelector(".website-picture");
    }
}

export default ScreenshotContainerView;