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

  const [selectedIncome, setSelectedIncome] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null);

  const navigateTo = (tabName) => {
    setActiveButton(tabName);
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
          {activeButton === 'view-transaction' && (
            <ViewTransaction
              setSelectedIncome={setSelectedIncome}
              setSelectedExpense={setSelectedExpense}
              navigateTo={navigateTo}
            />
          )}
          {activeButton === 'income' && (
            <Income
              selectedIncome={selectedIncome}
              setSelectedIncome={setSelectedIncome}
            />
          )}
          {activeButton === 'expense' && (
            <Expense
              selectedExpense={selectedExpense}
              setSelectedExpense={setSelectedExpense}
            />
          )}
        </div>
      </div>
  );
}

export default Main;
