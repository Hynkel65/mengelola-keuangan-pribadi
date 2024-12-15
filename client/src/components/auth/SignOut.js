import React, { useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';

const SignOut = () => {
  // Retrieve the signout function from the global context
  const { signout } = useContext(GlobalContext);

  // Function to handle the signout process
  const handleSignout = async () => {
    try {
      const success = await signout(); // Attempt to sign out

      if (success) {
        window.location.reload(); // Reload the page on successful signout
      } else {
        console.error('Failed to sign out'); // Log an error if signout fails
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