import firebase, { FirebaseError } from 'firebase';


enum Collections {
    USER = 'user'
};

export const storeUser = async (user: firebase.User) => {
    const db = firebase.firestore();

    // Check if the user is logging in for the first time
    const query = await db.collection(Collections.USER).doc(user.uid).get();
    const isNewUser = query.exists === false;

    try {
        const result = await db.collection(Collections.USER).doc(user.uid).set({
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
            email: user.email,
            emailVerified: user.emailVerified,
            lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
            // Add a created timestamp if it's a new user
            ...isNewUser ? {
                created: firebase.firestore.FieldValue.serverTimestamp()
            } : {}
        });

        return result;
    } catch (error) {
        const e = error as FirebaseError;
        console.log(e);
    }
}
