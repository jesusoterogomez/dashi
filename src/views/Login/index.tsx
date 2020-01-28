import React from 'react';
import firebase from 'firebase';
import {loginWithGoogle} from 'firebase-utils/auth';
import {useAuthState} from 'react-firebase-hooks/auth';
import { Redirect } from '@reach/router';

const Profile = () => {
  const [user, isLoading, error] = useAuthState(firebase.auth());

  if (isLoading) {
    return (
      <div>
        <p>isLoading User...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
      </div>
    );
  }
  if (user) {
    return <Redirect from="" to="/" noThrow/>;
  }
  return <button onClick={loginWithGoogle}>Log in</button>;
};

export default Profile;
