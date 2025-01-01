import React, { useState, useContext } from 'react';
import { createRoot } from 'react-dom/client';
import { GlobalProvider, GlobalContext } from './components/context/GlobalState';
import Main from './components/Main';
import Signin from './components/auth/Signin';
import Signup from './components/auth/Signup';
import axios from 'axios';
import './components/style/Index.css';

axios.defaults.withCredentials = true;

function App() {
  const [showLogin, setShowLogin] = useState(true);
  const { isAuthenticated } = useContext(GlobalContext);

  return (
    <GlobalProvider>
      {!isAuthenticated ? (
        <div className="auth-container">
          {showLogin ? (
            <>
              <Signin />
              <p>
                Tidak punya akun?{' '}
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
                Sudah punya akun?{' '}
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
        <Main />
      )}
    </GlobalProvider>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
