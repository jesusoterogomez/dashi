import * as functions from 'firebase-functions';

// Functions
import googleCalendar from './googleCalendar';

// If the firebase function emulator is running, the functions won't have access to the production firebase services (firestore)
// if we don't override the GOOGLE_APPLICATION_CREDENTIALS environment variable to use the firebase service account.
// The .firebase.service_account.json is git ignored and can be downloaded from the Firebase console: (Project Settings > Service accounts)
// @see: https://github.com/firebase/firebase-tools/issues/1412#issuecomment-504561828
if (process.env.FUNCTIONS_EMULATOR) {
    const credentialPath = '../.firebase.service_account.json';
    process.env.GOOGLE_APPLICATION_CREDENTIALS = credentialPath;
}

const region = 'europe-west1';
const createFunction = (invokeFunction: any) =>
    functions.region(region).https.onCall(invokeFunction);

export const authorizeGoogleCalendar = createFunction(googleCalendar.authorize);
export const setupGoogleCalendar = createFunction(googleCalendar.setup);

// For later:
// https://github.com/firebase/functions-samples/tree/master/spotify-auth/functions
