import React from 'react';
import firebase from 'firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import googleCalendar from 'integrations/googleCalendar';
import { RouteComponentProps } from "@reach/router";

type Props = RouteComponentProps;

const Profile = (props: Props) => {
    const [user] = useAuthState(firebase.auth());

    if (user) {
        return (
            <div>
                <p>Current User: {user.email}</p>

                <button onClick={googleCalendar.enable}>Enable Google Calendar</button>
            </div>
        );
    }
    return <div>woot</div>;
};

export default Profile;


// import qs from 'query-string';

// const getOAuthCode = (query: string | undefined) => {
//     if (!query) {
//         return false;
//     }

//     const params = qs.parse(query);
//     return params.code as string;
// }


    // useEffect(() => {
    //     const code = getOAuthCode(props.location?.search);

    //     async function handleOauthCode(code: string) {
    //         await googleCalendar.store(code);
    //     }

    //     if (code) {
    //         handleOauthCode(code);
    //     }
    // });

    // If code has been stored, redirect to
    // if (codeStored) {
        // return <Redirect to="/profile" noThrow />
    // }
