import firebase from 'firebase';

const REGION = 'europe-west1';

// Support region in cloud functions for production and development
// @see: https://www.reddit.com/r/Firebase/comments/anqeze/function_emulator_not_using_configured_region/
const functions =
    process.env.NODE_ENV === 'production'
        ? () => firebase.app().functions(REGION) // Use live service + region target
        : () => firebase.functions(); // Use emulator

const OAUTH_CALLBACK_URL = `${window.location.protocol}//${window.location.host}/oauth/callback`;

const enable = async () => {
    try {
        const payload = {
            redirectUrl: OAUTH_CALLBACK_URL,
        };

        const { data } = await functions().httpsCallable(
            'authorizeGoogleCalendar'
        )(payload);

        // Redirect to auth URL
        window.location.href = data;
    } catch (error) {
        console.error(error);
    }
};

const setup = async (code: string) => {
    try {
        const payload = {
            redirectUrl: OAUTH_CALLBACK_URL,
            code,
        };

        const response = await functions().httpsCallable('setupGoogleCalendar')(
            payload
        );

        return response;
    } catch (error) {
        console.error(error);
    }
};

const disable = () => {
    return true;
};

export default {
    enable,
    setup,
    disable,
};
