import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { google } from 'googleapis';

// Typings @note: These aren't exported from the googleapis library by default
import { OAuth2Client } from '../node_modules/google-auth-library/build/src/auth/oauth2client';
import { Credentials } from '../node_modules/google-auth-library/build/src/auth/credentials';

admin.initializeApp();

const INTEGRATIONS_DB_COLLECTION = 'integrations';

// @see: https://developers.google.com/calendar/auth#OAuth2Authorizing
// Minimum possible scope to count the number of daily Google calendar events per day
const SCOPES = [
    'email', // Used to get the email of the user who authenticated the integration.
    'profile', // Used to get the name of the user who authenticated the integration.
    'https://www.googleapis.com/auth/calendar.events.readonly',
];

const getOAuth2Client = (redirectUrl: string) => {
    const CLIENT_ID = functions.config().google_oauth.id;
    const CLIENT_SECRET = functions.config().google_oauth.secret;
    const REDIRECT_URL = redirectUrl;

    return new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
};

/**
 * Returns the display name and the email address of the current user
 *
 * @see: https://developers.google.com/people/api/rest/v1/people/get
 * @param client OAuth2Client - Google OAuth2Client configured with client ID, secret and redirect URL.
 * @param credentials - Credentials object containing access token, to authenticate Google API calls
 */
const getProfileData = async (
    client: OAuth2Client,
    credentials: Credentials
) => {
    // Limit the properties of the user profile that the application is fetching to the minimum required
    // Name and email is enough to display to user to let them know which account they associated with the integration
    // See documentation about Person Fields Mask in https://developers.google.com/people/api/rest/v1/people/get
    const personFieldsMask = 'emailAddresses,names';

    client.setCredentials(credentials);
    const me = await google.people('v1').people.get({
        auth: client,
        resourceName: 'people/me',
        personFields: personFieldsMask,
    });

    // Extract the first display name and email found.
    const emailAddress = me.data.emailAddresses?.shift();
    const name = me.data.names?.shift();

    return {
        displayName: name?.displayName as string,
        email: emailAddress?.value?.toLowerCase() as string,
        // Always display/store emails in lowercase
        // Emails are displayed in title case when returned from this endpoint
    };
};

/**
 * Returns an authentication URL to authorize Google Calendar through a Google consent screen
 * @param data
 * - redirectUrl - OAuth2 callback URL
 */
const authorize = (
    data: { redirectUrl: string },
    _context: functions.https.CallableContext
) => {
    const client = getOAuth2Client(data.redirectUrl);

    const url = client.generateAuthUrl({
        access_type: 'offline', // 'offline' (gets refresh_token)
        scope: SCOPES,
    });

    return url;
};

/**
 * Completes the OAuth authorization flow and stores the users' refresh_token in firestore.
 * @param data
 * - code        - OAuth2 authorization code
 * - redirectUrl - OAuth2 callback URL
 */
const setup = async (
    data: { code: string; redirectUrl: string },
    context: functions.https.CallableContext
) => {
    const client = getOAuth2Client(data.redirectUrl);
    const { tokens } = await client.getToken(data.code);

    // Disallow unauthenticated users from setting up integrations
    if (!context.auth?.uid) {
        return false;
    }

    const { uid } = context.auth; // Firebase User ID

    // @todo: Fail process if user denies the required scopes for this integration.
    const { scopes } = await client.getTokenInfo(tokens.access_token as string); // Get user-selected scopes

    // The google calendar account selected during the consent screen might be different than the logged into Dashi,
    // Therefore, we need to fetch the user profile of the selected account in the OAuth2 permission grant flow, to
    // be able to display to the user at a later point which account is associated with the service.
    const { displayName, email } = await getProfileData(client, tokens);

    // Store refresh token in firestore
    const db = admin.firestore();
    await db
        .collection(INTEGRATIONS_DB_COLLECTION)
        .doc(uid)
        .set(
            {
                googleCalendar: {
                    scopes: scopes,
                    enabled_at: admin.firestore.FieldValue.serverTimestamp(),
                    refresh_token: tokens.refresh_token,
                    displayName: displayName,
                    email: email,
                },
            },
            { merge: true }
        );

    return {
        status: 'success',
        code: `GCAL_ENABLED_SUCCESS`,
        message: `Set up Google Calendar integration as ${displayName} - ${email}`,
    };
};

export default {
    authorize,
    setup,
};
