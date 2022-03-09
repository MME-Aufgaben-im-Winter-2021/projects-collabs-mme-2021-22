/* eslint-env browser */

class Project {
    constructor(name, id, frames) {
        this.name = name;
        this.id = id;
        // this.frames = [{ title: 'Hot Since 82', timestamp: '1651545151', id: '-Mxf3HE-xoyx7FJM-vqB', imageBase64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAB4AA…gCIIgCIIgCIIgCMKVwP8HCJ2bjj7RicQAAAAASUVORK5CYII=' }];
        this.frames = frames;
        // Sort frames by newest timestamp
        // https://stackoverflow.com/a/7889040
        this.frames.sort((a, b) => b.timestamp - a.timestamp);
    }

    getFirstScreenshot() {
        // TODO: check if replaceable with cleverer method
        return this.frames[0].imageBase64;
    }

    getFirstID() {
        return this.frames[0].id;
    }

    // eslint-disable-next-line consistent-return
    getScreenshotByID(id) {
        for (const frame of this.frames) {
            if (frame.id === id) {
                return frame.imageBase64;
            }
        }
    }

}

export default Project;