/* eslint-env browser */

import {Event, Observable} from "../src/utils/Observable.js";

class Model extends Observable {
    constructor() {
        super();
    }

    toolAddButtonClicked(event) {
        console.log("toolAddButtonClicked");
    }
}

export default Model;