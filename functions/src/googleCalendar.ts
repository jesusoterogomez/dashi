import * as functions from 'firebase-functions';
import {google} from 'googleapis';

// @see: https://developers.google.com/calendar/auth#OAuth2Authorizing
const SCOPES = [
    'https://www.googleapis.com/auth/calendar.events.readonly'
];

const getOAuth2Client = (redirectUrl: string) => {
    const CLIENT_ID = '809741121253-bm30ph41e5i9gs78i5pmb9eu9d3odg7p.apps.googleusercontent.com';
    const CLIENT_SECRET = 'D7JxZoeVoCuo8TUrShx5h-H3';
    const REDIRECT_URL = redirectUrl;

    return new google.auth.OAuth2(
        CLIENT_ID,
        CLIENT_SECRET,
        REDIRECT_URL
    );
};

/**
 * Returns an authentication URL to authorize Google Calendar through a Google consent screen
 * @param data
 * - redirectUrl - OAuth2 callback URL
 */
const authorize = (data: {redirectUrl: string}, _context: functions.https.CallableContext) => {
    const client = getOAuth2Client(data.redirectUrl);

    const url = client.generateAuthUrl({
        access_type: 'offline', // 'offline' (gets refresh_token)
        scope: SCOPES
    });

    return url;
}

/**
 * Completes the OAuth authorization flow and stores the users' refresh_token in firestore.
 * @param data
 * - code        - OAuth2 authorization code
 * - redirectUrl - OAuth2 callback URL
 */
const setup = async (data: {code: string, redirectUrl: string}, context: functions.https.CallableContext) => {
    const oauthClient = getOAuth2Client(data.redirectUrl);
    const {tokens} = await oauthClient.getToken(data.code);

    // Store refresh token in firestore

    return {
        uid: context.auth?.uid,
        refresh_token: tokens.refresh_token
    };
}


export default {
    authorize,
    setup
};
