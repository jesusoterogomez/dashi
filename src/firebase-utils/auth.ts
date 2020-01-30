import firebase from 'firebase';
import { storeUser } from './firestore';

type AuthenticationCredential = {
    idToken: string;
    accessToken: string;
    providerId: string;
    signingMethod: string;
};

const loginWithGoogle = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();

    // provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

    try {
        const {
            user,
            // credential
        } = await firebase.auth().signInWithPopup(provider);

        const u = user as firebase.User;
        // This gives you a Google Access Token. You can use it to access the Google API.
        // const { accessToken } = credential as unknown as AuthenticationCredential;
        await storeUser(u);
        return user;
    } catch (error) {
        // const errorCode = error.code;
        // const errorMessage = error.message;
        // The email of the user's account used.
        // const email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        // const credential = error.credential;
    }
};

const logout = () => {
    firebase.auth().signOut();
};

export { loginWithGoogle, logout };
