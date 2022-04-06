/* eslint-env browser */

import { Event, Observable } from "../utils/Observable.js";
import CONFIG from "../utils/Config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, signInAnonymously } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-auth.js";
import { getDatabase, ref, set, push, child, get } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-database.js";

class DatabaseHandler extends Observable {
    constructor() {
        super();
        this.app = initializeApp(CONFIG.FIREBASE_CONFIG);
    }

    // used to identify users without login, that use a project key
    loginAnonymously(projectKey) {
        let auth = getAuth(this.app);
        signInAnonymously(auth)
            .then((result) => {
                const currentUser = result.user;
                this.checkUserHasProfile(currentUser.uid, CONFIG.ANONYMOUS_USER_NAME);
                this.notifyAll(new Event("anonymousUserSignInSuccessful", {
                    user: currentUser,
                    id: projectKey,
                }));
            })
            .catch((error) => {
                const errorCode = error.code,
                    errorMessage = error.message;
                console.log(`errorCode: ${errorCode}`);
                console.log(`errorMessage: ${errorMessage}`);
            });
    }

    // User Authentication with Google via Popup
    // https://firebase.google.com/docs/auth/web/google-signin#handle_the_sign-in_flow_with_the_firebase_sdk
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
                console.log(token);
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

    // It is necessary to store all users explicitly, to also store which project each user is allowed to access.
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

    // Does what the name says: Logs out the current user.
    // https://firebase.google.com/docs/auth/web/google-signin#next_steps
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

    // Stores a new comment.
    storeNewComment(commentText, projectID, frameID, color) {
        // Projects that have no frames yet during the creation process cannot be commented
        if (projectID === null) {
            console.log("Cannot comment on empty Project");
            return;
        }
        const db = getDatabase(this.app),
            currentUser = getAuth(this.app).currentUser;
        let currentDisplayName = currentUser.displayName;
        // Anonymous users are all displayed as "Anonymous"
        if (currentDisplayName === null) {
            currentDisplayName = CONFIG.ANONYMOUS_USER_NAME;
        }
        // eslint-disable-next-line one-var
        const commentData = {
                author: currentDisplayName,
                color: color,
                userID: currentUser.uid,
                text: commentText,
                timestamp: new Date().getTime(), // useful for sorting by newest
            },
            newCommentKey = this.generateNewKey(`projects/${projectID}/frames/${frameID}/comments`);
        set(ref(db, `projects/${projectID}/frames/${frameID}/comments/${newCommentKey}`), commentData)
            // new comment will be displayed by the UI when storing was successful 
            .then(() => this.notifyAll(new Event("newCommentStored", commentData)));
    }

    // Stores a new Screenshot.
    storeNewScreenshot(projectID, frameBase64, frameTitle, projectName) {
        const db = getDatabase(this.app);
        if (projectID === null) { // new project detected!
            // eslint-disable-next-line no-param-reassign
            projectID = this.generateNewKey("projects");
            const currentUserID = getAuth(this.app).currentUser.uid;
            set(ref(db, `projects/${projectID}/name`), projectName)
                .then(() => console.log("new name stored"))
                .catch((error) => {
                    console.error(error);
                });
            set(ref(db, `users/${currentUserID}/projects/${projectID}`), projectName)
                .then(() => console.log("new project link stored"))
                .catch((error) => {
                    console.error(error);
                });
            set(ref(db, `projects/${projectID}/creator`), currentUserID)
                .then(() => console.log("creator stored"))
                .catch((error) => {
                    console.error(error);
                });
        }
        // eslint-disable-next-line one-var
        const newFrameKey = this.generateNewKey(`projects/${projectID}/frames`),
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

    // Generates a new key inside the given path.
    generateNewKey(path) {
        const db = getDatabase(this.app);
        return push(child(ref(db), path)).key;
    }

    // Loads the projects that are accessible for the current user and notifies the UI when done.
    // https://firebase.google.com/docs/database/web/read-and-write#read_data
    getProjectList() {
        const db = getDatabase(this.app),
            currentUserID = getAuth(this.app).currentUser.uid;
        get(ref(db, `users/${currentUserID}/projects`))
            .then((snapshot) => {
                if (snapshot.exists()) { // if no projects are associated to the user, we can stop here
                    console.log(snapshot);
                    let result = [];
                    snapshot.forEach((child) => {
                        const projectID = child.key, // logs keys
                            // https://stackoverflow.com/a/43586692
                            projectName = snapshot.child(`${projectID}`).val(); // extracts every project's name
                        // console.log(projectID);
                        // console.log(projectName);
                        result.push({
                            name: projectName,
                            id: projectID,
                        });
                    });
                    // hand over project list to the UI
                    this.notifyAll(new Event("projectListReady", result));
                } else {
                    console.log("No data available");
                }
            }).catch((error) => {
                console.log(error);
            });
    }

    // Loads a certain project's data from the database and prepares it to be displayed in the UI.
    // Returns a Promise.
    loadProjectSnapshot(projectID) {
        const db = getDatabase(this.app);
        return new Promise((resolve, reject) => {
            get(ref(db, `projects/${projectID}`))
                .then((snapshot) => {
                    // if project not available, e.g. because the key is wrong, we can stop the execution here
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
                        // resolve Promise when all data is processed
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

    // Loads Comments for a certain frame in a project and prepares them to be displayed in the UI.
    // Returns a Promise.
    loadComments(projectID, frameID) {
        const db = getDatabase(this.app),
            currentUserID = getAuth(this.app).currentUser.uid;
        return new Promise((resolve, reject) => {
            if (projectID === null) {
                reject(new Error("Cannot load comments for unpublished project.\nIf you are just creating a new Project everything is fine and you can ignore this error."));
            }
            get(ref(db, `projects/${projectID}/frames/${frameID}/comments`))
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        let frameComments = [];
                        snapshot.forEach((child) => { // store in array to allow sorting the comments
                            let currentCommentID = child.key,
                                currentAuthorID = snapshot.child(`${currentCommentID}/author_id`).val(),
                                currentAuthorName = snapshot.child(`${currentCommentID}/author`).val(),
                                currentColor = snapshot.child(`${currentCommentID}/color`).val(),
                                currentText = snapshot.child(`${currentCommentID}/text`).val(),
                                currentTimestamp = snapshot.child(`${currentCommentID}/timestamp`).val(),
                                currentUpvotes = 0,
                                currentDownvotes = 0,
                                currentUserHasUpvoted = false,
                                currentUserHasDownvoted = false;
                            snapshot.child(`${currentCommentID}/votes`).forEach((vote) => {
                                if (vote.val() === CONFIG.DOWNVOTE_VALUE) {
                                    currentDownvotes++;
                                    if (vote.key === currentUserID) {
                                        currentUserHasDownvoted = true;
                                    }
                                } else if (vote.val() === CONFIG.UPVOTE_VALUE) {
                                    currentUpvotes++;
                                    if (vote.key === currentUserID) {
                                        currentUserHasUpvoted = true;
                                    }
                                }
                            });
                            if (currentAuthorName === null) {
                                currentAuthorName = CONFIG.ANONYMOUS_USER_NAME;
                            }
                            frameComments.push({ // add each comment to the list
                                id: currentCommentID,
                                authorID: currentAuthorID,
                                author: currentAuthorName,
                                color: currentColor,
                                text: currentText,
                                timestamp: currentTimestamp,
                                upvotes: currentUpvotes,
                                downvotes: currentDownvotes,
                                currentUserHasUpvoted: currentUserHasUpvoted,
                                currentUserHasDownvoted: currentUserHasDownvoted,
                            });
                        });
                        // resolve Promise when all comments are processed
                        resolve(frameComments);
                    } else {
                        reject(new Error("No comments available or loading failed."));
                    }
                }).catch((error) => {
                    console.error(error);
                });
        });
    }

    userIsLoggedIn() {
        return getAuth(this.app).currentUser !== null;
    }

    linkProject(projectID) {
        const db = getDatabase(this.app),
            currentUserID = getAuth(this.app).currentUser.uid;
        get(ref(db, `projects/${projectID}/name`))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const projectName = snapshot.val();
                    set(ref(db, `users/${currentUserID}/projects/${projectID}`), projectName)
                        .then(() => {
                            console.log("project sucessfully linked with current user");
                            this.getProjectList();
                            this.notifyAll(new Event("projectLinkedToUser", { id: projectID }));
                        })
                        .catch((error) => console.log(error));
                }
            }).catch((error) => {
                console.log(error);
            });

    }

    deleteProject(projectID) {
        const db = getDatabase(this.app),
            currentUserID = getAuth(this.app).currentUser.uid;
        get(ref(db, `projects/${projectID}/creator`))
            .then((snapshot) => {
                if (snapshot.exists() && snapshot.val() === currentUserID) {
                    set(ref(db, `projects/${projectID}`), null) // setting value to null deletes the keys
                        .then(() => {
                            console.log("project sucessfully deleted by its author");
                        })
                        .catch((error) => console.log(error));
                    // definetely not elegant and safe at all, but it works
                    get(ref(db, "users"))
                        .then((snapshot) => {
                            if (snapshot.exists()) {
                                snapshot.forEach((child) => { // store in array to allow sorting
                                    if (child.child("projects").hasChild(projectID)) {
                                        const userID = child.key;
                                        set(ref(db, `users/${userID}/projects/${projectID}`), null) // setting value to null deletes the keys
                                            .then(() => {
                                                if (userID === currentUserID) {
                                                    // TODO: add reloading UI after deleting project here, probably best is displaying the homescreen
                                                    this.notifyAll(new Event("projectSucessfullyDeleted"));
                                                }
                                            }).catch((error) => {
                                                console.error(error);
                                            });
                                    }
                                });
                            }
                        }).catch((error) => {
                            console.error(error);
                        });
                }
            }).catch((error) => {
                console.log(error);
            });
    }

    storeCanvas(projectID, frameID, canvasPNG) {
        const db = getDatabase(this.app);
        set(ref(db, `projects/${projectID}/frames/${frameID}/canvas_base64`), canvasPNG) // setting value to null deletes the keys
            .then(() => {
                console.log("canvas stored sucessfully");
            }).catch((error) => {
                console.error(error);
            });
    }

    getCanvas(projectID, frameID) {
        const db = getDatabase(this.app);
        get(ref(db, `projects/${projectID}/frames/${frameID}/canvas_base64`))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const canvasImage = snapshot.val();
                    this.notifyAll(new Event("canvasLoaded", { canvasImageBase64: canvasImage }));
                }
            }).catch((error) => {
                console.log(error);
            });
    }

    setCommentVote(projectID, frameID, commentID, value) {
        const db = getDatabase(this.app),
            currentUserID = getAuth(this.app).currentUser.uid;
        set(ref(db, `projects/${projectID}/frames/${frameID}/comments/${commentID}/votes/${currentUserID}`), value)
            .then(() => {
                console.log(`stored your vote: ${value}`);
            }).catch((error) => {
                console.error(error);
            });
    }
}

export default DatabaseHandler;