
import firebase from 'firebase';

const enable = async () => {
    // const functions = firebase.app().functions('europe-west1');
    try {
        const payload = {
            redirectUrl: `${window.location.protocol}//${window.location.host}/oauth/callback`
        };

        const {data} = await firebase.functions().httpsCallable('authorizeGoogleCalendar')(payload);
        window.location.href = data;
    } catch(error) {
        console.error(error);
    }
}

const setup = async (code: string) => {
    try {
        const payload = {
            redirectUrl: `${window.location.protocol}//${window.location.host}/oauth/callback`,
            code
        };

        const response = await firebase.functions().httpsCallable('setupGoogleCalendar')(payload);

        return response;
    } catch(error) {
        console.error(error);
    }

    // const {tokens} = await oauth2Client.getToken(code)

}

const disable = () => {
    return true;
}

export default {
    enable,
    setup,
    disable
};
