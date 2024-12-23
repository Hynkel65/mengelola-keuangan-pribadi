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
  // State to track the active tab
  const [activeButton, setActiveButton] = useState('dashboard');
  const [isNavVisible, setIsNavVisible] = useState(window.innerWidth > 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsNavVisible(window.innerWidth > 1024);
    };
  
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handler to update active tab based on button click
  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
    setIsNavVisible(window.innerWidth > 1024);
  };

  // Toggles the visibility of the navbar
  const toggleNavbar = () => {
    setIsNavVisible(!isNavVisible);
  };

  // State to track selected income and expense
  const [selectedIncome, setSelectedIncome] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null);

  // Function to navigate to a specific tab
  const navigateTo = (tabName) => {
    setActiveButton(tabName);
  };

  return (
    <div className="container">
      <button className="toggle-button" onClick={toggleNavbar}>
        {isNavVisible ? 'Sembunyikan' : 'Tampilkan'} Menu
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