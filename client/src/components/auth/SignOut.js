import React, { useContext } from 'react'; // Import React and useContext
import { GlobalContext } from '../context/GlobalState'; // Import GlobalContext for state management

const SignOut = () => {
  const { signout } = useContext(GlobalContext); // Access the signout function from the context

  const handleSignout = async () => {
    const success = await signout();
    if (success) {
      console.log('Successfully signed out');
      window.location.reload();
    } else {
      console.error('Failed to sign out');
    }
  };

  return (
    <button onClick={handleSignout}>
      Sign Out
    </button>
  );
};

export default SignOut;