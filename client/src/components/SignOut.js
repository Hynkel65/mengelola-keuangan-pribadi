import React, { useContext } from 'react';
import { GlobalContext } from './context/GlobalState';

const SignOut = () => {
  const { handleSignOut } = useContext(GlobalContext);

  return (
    <div className="sign-out" onClick={handleSignOut}>
      Sign Out
    </div>
  );
};

export default SignOut;
