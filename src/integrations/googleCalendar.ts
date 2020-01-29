
import firebase from 'firebase';

const OAUTH_CALLBACK_URL = `${window.location.protocol}//${window.location.host}/oauth/callback`;

const enable = async () => {
    try {
        const payload = {
            redirectUrl: OAUTH_CALLBACK_URL
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
            redirectUrl: OAUTH_CALLBACK_URL,
            code
        };

        const response = await firebase.functions().httpsCallable('setupGoogleCalendar')(payload);
        return response;
    } catch(error) {
        console.error(error);
    }
}

const disable = () => {
    return true;
}

export default {
    enable,
    setup,
    disable
};
