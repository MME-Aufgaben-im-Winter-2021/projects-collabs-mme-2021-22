/* eslint-env browser */

import Observable from "../utils/Observable.js";

class ScreenshotContainerView extends Observable {
    constructor(container) {
        super();
        this.body = container.querySelector(".screenshot");
    }

    exchangeImage(sourceURL) {
        this.body.src = sourceURL;
    }
}

export default ScreenshotContainerView;