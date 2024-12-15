import React, { useState, useContext } from 'react';
import { GlobalProvider, GlobalContext } from './components/context/GlobalState';
import Main from './components/Main';
import Signin from './components/auth/Signin';
import Signup from './components/auth/Signup';
import './App.css';

function App() {
  // State to toggle between Signin and Signup components
  const [showLogin, setShowLogin] = useState(true);
  // Accessing the authentication status from GlobalContext
  const { isAuthenticated } = useContext(GlobalContext);

  return (
    <GlobalProvider>
      {/* If the user is not authenticated, show authentication options */}
      {!isAuthenticated ? (
        <div className="auth-container">
          {showLogin ? (
            <>
              <Signin />
              <p>
                Don't have an account?{' '}
                <span
                  onClick={() => setShowLogin(false)}
                  style={{ color: '#00a2ff', cursor: 'pointer' }}
                >
                  Sign up
                </span>
              </p>
            </>
          ) : (
            <>
              <Signup />
              <p>
                Already have an account?{' '}
                <span
                  onClick={() => setShowLogin(true)}
                  style={{ color: '#00a2ff', cursor: 'pointer' }}
                >
                  Sign in
                </span>
              </p>
            </>
          )}
        </div>
      ) : (
        // If the user is authenticated, show the Main component
        <Main />
      )}
    </GlobalProvider>
  );
}

export default App;