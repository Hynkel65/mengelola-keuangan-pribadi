import React, { useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';

const SignOut = () => {
  const { signout } = useContext(GlobalContext);

  const handleSignout = async () => {
    try {
      const success = await signout();

      if (success) {
        window.location.reload();
      } else {
        console.error('Failed to sign out');
      }
    } catch (error) {
      console.error('An error occurred during signout', error);
    }
  };

  return (
    <button onClick={handleSignout}>
      Sign Out
    </button>
  );
};

export default SignOut;