/* eslint-env browser */

import { Event, Observable } from "../utils/Observable.js";
import CONFIG from "../utils/Config.js";
import { generateRandomRGBString } from "../utils/Utilities.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, signInAnonymously } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-auth.js";
import { getDatabase, ref, set, push, child, get } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-database.js";

class DatabaseHandler extends Observable {
    constructor() {
        super();
        this.app = initializeApp(CONFIG.FIREBASE_CONFIG);
    }

    loginAnonymously() {
        let auth = getAuth(this.app);
        signInAnonymously(auth)
            .then((result) => {
                const currentUser = result.user;
                this.checkUserHasProfile(currentUser.uid, CONFIG.ANONYMOUS_USER_NAME);
                this.notifyAll(new Event("userSignInSuccessful", { user: currentUser }));
            })
            .catch((error) => {
                const errorCode = error.code,
                    errorMessage = error.message;
                console.log(`errorCode: ${errorCode}`);
                console.log(`errorMessage: ${errorMessage}`);
            });
    }

    performSignInWithPopup() {
        const provider = new GoogleAuthProvider(),
            auth = getAuth(this.app);
        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result),
                    token = credential.accessToken,
                    // The signed-in user info.
                    user = result.user;
                // console.log(token);
                console.log(user);
                this.checkUserHasProfile(user.uid, user.displayName);
                this.notifyAll(new Event("userSignInSuccessful", { user: user }));
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code,
                    errorMessage = error.message,
                    // The email of the user's account used.
                    email = error.email,
                    // The AuthCredential type that was used.
                    credential = GoogleAuthProvider.credentialFromError(error);
                console.log(email, credential);
                console.log(`errorCode: ${errorCode}`);
                console.log(`errorMessage: ${errorMessage}`);
                this.notifyAll(new Event("userSignInFailed", {
                    errorCode: errorCode,
                    errorMessage: errorMessage,
                }));
            });
    }

    checkUserHasProfile(userID, displayName) {
        const db = getDatabase(this.app);
        get(ref(db, `users/${userID}`))
            .then((snapshot) => {
                if (!snapshot.exists()) {
                    set(ref(db, `users/${userID}/displayName`), displayName)
                        .then(() => console.log("user added to database"))
                        .catch((error) => console.log(error));
                }
            }).catch((error) => {
                console.log(error);
            });
    }

    logout() {
        const auth = getAuth(this.app);
        signOut(auth).then(() => {
            // Sign-out successful.
            console.log("Sign-out successful.");
            this.notifyAll(new Event("userSignOutSuccessful"));
        }).catch((error) => {
            // An error happened.
            console.log(`Sign-out failed: ${error}`);
            this.notifyAll(new Event("userSignOutFailed", { error: error }));
        });
    }

    writeToDatabase() {
        const db = getDatabase(this.app);
        set(ref(db, "test/test_id"), {
            test1: "test2",
            test3: "test4",
            test5: "test6",
        }).then(() => console.log("success"));
    }

    storeNewComment(commentText, projectID, frameID) {
        const db = getDatabase(this.app),
            currentUser = getAuth(this.app).currentUser;
        let currentDisplayName = currentUser.displayName;
        if (currentDisplayName === null) {
            currentDisplayName = CONFIG.ANONYMOUS_USER_NAME;
        }
        // eslint-disable-next-line one-var
        const commentData = { //TODO: add color
            author: currentDisplayName,
            color: generateRandomRGBString(),
            userID: currentUser.uid,
            text: commentText,
            rating: 0,
            timestamp: new Date().getTime(),
        },
            newCommentKey = this.generateNewKey(`projects/${projectID}/frames/${frameID}/comments`);
        set(ref(db, `projects/${projectID}/frames/${frameID}/comments/${newCommentKey}`), commentData)
            .then(() => this.notifyAll(new Event("newCommentStored", commentData)));
    }

    storeNewScreenshot(projectID, frameBase64, frameTitle) {
        const db = getDatabase(this.app),
            newFrameKey = this.generateNewKey(`projects/${projectID}/frames`),
            newFrameData = {
                image_base64: frameBase64,
                timestamp: new Date().getTime(),
                title: frameTitle,
            };
        set(ref(db, `projects/${projectID}/frames/${newFrameKey}`), newFrameData)
            // .then(() => this.notifyAll(new Event("newFrameStored", {
            //     frameData: newFrameData,
            //     key: newFrameKey,
            //     })))
            .then(() => this.notifyAll(new Event("newFrameStored", { id: projectID })))
            .catch((error) => {
                console.error(error);
            });
    }

    readData() {
        // https://firebase.google.com/docs/database/web/read-and-write?authuser=0#read_data_once
        console.log("readData");
        const db = getDatabase(this.app);
        get(ref(db, "projects"))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    console.log(snapshot);
                    snapshot.forEach((child) => console.log(child.key)); // logs keys
                } else {
                    console.log("No data available");
                }
            }).catch((error) => {
                console.log(error);
            });
    }

    generateNewKey(path) {
        const db = getDatabase(this.app);
        return push(child(ref(db), path)).key;
    }

    getProjectList() {
        const db = getDatabase(this.app);
        get(ref(db, "projects"))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    console.log(snapshot);
                    let result = [];
                    snapshot.forEach((child) => {
                        const projectID = child.key, // logs keys
                            // https://stackoverflow.com/a/43586692
                            projectName = snapshot.child(`${projectID}/name`).val(); // extracts every project's name
                        // console.log(projectID);
                        // console.log(projectName);
                        result.push({
                            name: projectName,
                            id: projectID,
                        });
                    });
                    this.notifyAll(new Event("projectListReady", result));
                } else {
                    console.log("No data available");
                }
            }).catch((error) => {
                console.log(error);
            });
    }

    loadProjectSnapshot(projectID) {
        const db = getDatabase(this.app);
        return new Promise((resolve, reject) => {
            get(ref(db, `projects/${projectID}`))
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        const projectName = snapshot.child("name").val();
                        let projectFrames = [];
                        snapshot.child("frames").forEach((child) => { // store in array to allow sorting
                            const currentFrameID = child.key,
                                currentFrameTimestamp = snapshot.child(`frames/${currentFrameID}/timestamp`).val(),
                                currentFrameTitle = snapshot.child(`frames/${currentFrameID}/title`).val(),
                                currentFrameImageBase64 = snapshot.child(`frames/${currentFrameID}/image_base64`).val();
                            projectFrames.push({
                                title: currentFrameTitle,
                                timestamp: currentFrameTimestamp,
                                id: currentFrameID,
                                imageBase64: currentFrameImageBase64,
                            });
                        });
                        resolve({
                            name: projectName,
                            frames: projectFrames,
                        });
                    } else {
                        reject(new Error("loading project failed"));
                    }
                }).catch((error) => {
                    console.error(error);
                });
        });
    }

    loadComments(projectID, frameID) {
        const db = getDatabase(this.app);
        return new Promise((resolve, reject) => {
            get(ref(db, `projects/${projectID}/frames/${frameID}/comments`))
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        let frameComments = [];
                        snapshot.forEach((child) => { // store in array to allow sorting
                            let currentCommentID = child.key,
                                currentAuthorID = snapshot.child(`${currentCommentID}/author_id`).val(),
                                currentAuthorName = snapshot.child(`${currentCommentID}/author`).val(),
                                currentColor = snapshot.child(`${currentCommentID}/color`).val(),
                                currentPosX = snapshot.child(`${currentCommentID}/pos_x`).val(),
                                currentPosY = snapshot.child(`${currentCommentID}/pos_y`).val(),
                                currentRating = snapshot.child(`${currentCommentID}/rating`).val(),
                                currentText = snapshot.child(`${currentCommentID}/text`).val(),
                                currentTimestamp = snapshot.child(`${currentCommentID}/timestamp`).val();
                            if (currentAuthorName === null) {
                                currentAuthorName = CONFIG.ANONYMOUS_USER_NAME;
                            }
                            frameComments.push({
                                id: currentCommentID,
                                authorID: currentAuthorID,
                                author: currentAuthorName,
                                color: currentColor,
                                posX: currentPosX,
                                posY: currentPosY,
                                rating: currentRating,
                                text: currentText,
                                timestamp: currentTimestamp,
                            });
                        });
                        resolve(frameComments);
                    } else {
                        reject(new Error("loading comments failed or no comments available"));
                    }
                }).catch((error) => {
                    console.error(error);
                });
        });
    }
}

export default DatabaseHandler;