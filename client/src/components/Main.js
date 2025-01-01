import React, { useState, useEffect } from 'react';
import './style/Main.css';
import Navigation from './Navigation';
import Header from './Header';
import SignOut from './auth/SignOut';
import Dashboard from './content/Dashboard';
import Analysis from './content/Analysis';
import ViewTransaction from './content/ViewTransactions';
import Income from './content/Income';
import Expense from './content/Expense';

function Main() {
  const [activeButton, setActiveButton] = useState('dashboard');
  const [isNavVisible, setIsNavVisible] = useState(window.innerWidth > 768);

  useEffect(() => {
    const handleResize = () => {
      setIsNavVisible(window.innerWidth > 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
    setIsNavVisible(window.innerWidth > 768);
  };

  const toggleNavbar = () => {
    setIsNavVisible(!isNavVisible);
  };

  const [selectedIncome, setSelectedIncome] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null);

  const navigateTo = (tabName) => {
    setActiveButton(tabName);
  };

  return (
    <div className="container">
      <button className="toggle-button" onClick={toggleNavbar}>
        ☰
      </button>
      <div className={`left-con ${isNavVisible ? '' : 'collapsed'}`}>
        <Header />
        <Navigation activeButton={activeButton} handleButtonClick={handleButtonClick} />
        <SignOut />
      </div>
      <div className="right-con">
        {activeButton === 'dashboard' && <Dashboard />}
        {activeButton === 'analisis' && <Analysis />}
        {activeButton === 'riwayat' && (
          <ViewTransaction
            setSelectedIncome={setSelectedIncome}
            setSelectedExpense={setSelectedExpense}
            navigateTo={navigateTo}
          />
        )}
        {activeButton === 'pemasukan' && (
          <Income
            selectedIncome={selectedIncome}
            setSelectedIncome={setSelectedIncome}
          />
        )}
        {activeButton === 'pengeluaran' && (
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