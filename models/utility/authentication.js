const {initializeApp} = require('@firebase/app');
const {getAuth, signInWithEmailAndPassword} = require('@firebase/auth');

const {firebaseConfig} = require('../../firestore/firebase-configuration');

class Authentication {
    static app = initializeApp(firebaseConfig);
    static auth = getAuth(this.app);

    static async login(email, password) {
        signInWithEmailAndPassword(this.auth, email, password) 
        .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.log(user.uid + " is signed in");
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode + " " + errorMessage);
            });
    }
} module.exports = Authentication;