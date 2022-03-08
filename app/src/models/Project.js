/* eslint-env browser */

class Project {
    constructor(name, id, frames) {
        this.name = name;
        this.id = id;
        // this.frames = [{ title: 'Hot Since 82', timestamp: '1651545151', id: '-Mxf3HE-xoyx7FJM-vqB', imageBase64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAB4AA…gCIIgCIIgCIIgCMKVwP8HCJ2bjj7RicQAAAAASUVORK5CYII=' }];
        this.frames = frames;
    }

    getFirstScreenshot() {
        // TODO: replace with wiser method
        return this.frames[0].imageBase64;
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