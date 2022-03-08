/* eslint-env browser */

import { Event, Observable } from "../utils/Observable.js";
import CONFIG from "../utils/Config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-auth.js";
import { getDatabase, ref, set, push, child } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-database.js";

const app = initializeApp(CONFIG.FIREBASE_CONFIG);

class DatabaseHandler extends Observable {
    constructor() {
        super();
        this.performSignInWithPopup();
    }

    performSignInWithPopup() {
        const provider = new GoogleAuthProvider(),
            auth = getAuth();
        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result),
                    token = credential.accessToken,
                    // The signed-in user info.
                    user = result.user;
                console.log(user, token);
                this.notifyAll(new Event("userSignInSuccessful", { user: user }));
                // ...
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

    logout() {
        const auth = getAuth();
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
        const db = getDatabase();
        set(ref(db, "test/test_id"), {
            test1: "test2",
            test3: "test4",
            test5: "test6",
        }).then(() => console.log("success"));
    }

    storeNewComment(commentText) {
        const db = getDatabase(app),
            currentUser = getAuth().currentUser,
            commentData = {
                author: currentUser.displayName,
                userID: currentUser.uid,
                text: commentText,
                rating: 0,
                timestamp: new Date().getTime(),
            },
            newPostKey = push(child(ref(db), "comments")).key;
        console.log(newPostKey);
        set(ref(db, "comments/" + newPostKey), commentData)
            .then(() => console.log("success"));
    }
}

export default DatabaseHandler;