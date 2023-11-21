const {initializeApp} = require('@firebase/app');
const {getAuth, signInWithEmailAndPassword, signOut} = require('@firebase/auth');
//calls teh firebase conifguration file in the firestore folder to get configurations
const {firebaseConfig} = require('../../firestore/firebase-configuration');

class Authentication {
    //Uses the client side firebase configurations to initialize the app to a private variable
    static #app = initializeApp(firebaseConfig);
    //initializes the firebase authentication with the app
    static #auth = getAuth(this.#app);
    /**
     * 
     * @param {string} email received from routes/login.js
     * @param {string} password password received from routes/login.js
     */
    static async login(email, password) {
        await signInWithEmailAndPassword(this.#auth, email, password) 
        .then((userCredential) => {
                // if all goes well then user is signed in
                const user = userCredential.user;
                console.log(user.uid + " is signed in");
                
            })
            .catch((error) => {
                //if there is an error it will output the code and message
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode + " " + errorMessage);
            });
    }

    //Logs out current user 
    static async logout() {
        signOut(auth).then(() => {
            console.log("user is logged out");
          }).catch((error) => {
            console.log("error logging out: " + error);
          });
    }

    /**
     * 
     * @returns String logged in users uid from firebase
     */
    static getUid() {
        if (this.#auth.currentUser) {
            return this.#auth.currentUser.uid;
        }
    }

} module.exports = Authentication;