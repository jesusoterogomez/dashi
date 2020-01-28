import * as functions from 'firebase-functions';

// Functions
import googleCalendar from './googleCalendar';

const region = 'europe-west1';
const createFunction = (invokeFunction: any) => functions.region(region).https.onCall(invokeFunction);

export const authorizeGoogleCalendar = createFunction(googleCalendar.authorize);
export const setupGoogleCalendar = createFunction(googleCalendar.setup);



// https://github.com/firebase/functions-samples/tree/master/spotify-auth/functions

// const createFunction = (invokeFunction: any) => functions.region(region).https.onRequest((request, response) => {
//     // Allow CORS to facilitate easier testing.
//     response.set('Access-Control-Allow-Origin', '*');
//     response.set('Access-Control-Allow-Credentials', 'true');

//     if (request.method === 'OPTIONS') {
//         // Send response to OPTIONS requests
//         response.set('Access-Control-Allow-Methods', '*');
//         response.set('Access-Control-Allow-Headers', '*');
//         response.set('Access-Control-Max-Age', '3600');
//         return response.status(204).send('');
//     }

//     return invokeFunction(request, response);
// });

// const uid = context.auth.uid;
// const name = context.auth.token.name || null;
// const picture = context.auth.token.picture || null;
// const email = context.auth.token.email || null;
