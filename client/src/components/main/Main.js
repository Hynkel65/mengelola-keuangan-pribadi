import React, { useState } from 'react';
import './style/Main.css';

import Navigation from './Navigation';
import Header from './Header';
import SignOut from './SignOut';

import Dashboard from './content/Dashboard';
import Analysis from './content/Analysis';
import ViewTransaction from './content/ViewTransactions';
import Income from './content/Income';
import Expense from './content/Expense';

function Main() {
  const [activeButton, setActiveButton] = useState('dashboard');

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  const handleSignOut = () => {
    console.log('User signed out.');
  };

  return (
      <div className="container">
        <div className="left-con">
          <Header />
          <Navigation activeButton={activeButton} handleButtonClick={handleButtonClick} />
          <SignOut handleSignOut={handleSignOut} />
        </div>
        <div className="right-con">
          {activeButton === 'dashboard' && <Dashboard />}
          {activeButton === 'analysis' && <Analysis />}
          {activeButton === 'view-transaction' && <ViewTransaction />}
          {activeButton === 'income' && <Income />}
          {activeButton === 'expense' && <Expense />}
        </div>
      </div>
  );
}

export default Main;
