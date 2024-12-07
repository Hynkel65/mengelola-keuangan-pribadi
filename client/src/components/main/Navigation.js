import React, { useState } from 'react';

const Navigation = ({ activeButton, handleButtonClick }) => {
  const [pressedButton, setPressedButton] = useState('');

  const handleClick = (buttonName) => {
    handleButtonClick(buttonName);
    setPressedButton(buttonName);
  };

  const handleButtonRelease = () => {
    setPressedButton('');
  };

  return (
    <div className="navigation">
      <div className="choose-nav">
        <div
          className={`dashboard overlap-group ${activeButton === 'dashboard' ? 'active' : ''} ${
            pressedButton === 'dashboard' ? 'pressed' : ''
          }`}
          onClick={() => handleClick('dashboard')}
          onMouseUp={handleButtonRelease}
        >
          <div className="text-wrapper">Dashboard</div>
        </div>
      </div>
      <div className="choose-nav">
        <div
          className={`analysis overlap-group ${activeButton === 'analysis' ? 'active' : ''} ${
            pressedButton === 'analysis' ? 'pressed' : ''
          }`}
          onClick={() => handleClick('analysis')}
          onMouseUp={handleButtonRelease}
        >
          <div className="text-wrapper">Analysis</div>
        </div>
      </div>
      <div className="choose-nav">
        <div
          className={`view-transaction overlap-group ${activeButton === 'view-transaction' ? 'active' : ''} ${
            pressedButton === 'view-transaction' ? 'pressed' : ''
          }`}
          onClick={() => handleClick('view-transaction')}
          onMouseUp={handleButtonRelease}
        >
          <div className="text-wrapper">View Transaction</div>
        </div>
      </div>
      <div className="choose-nav">
        <div
          className={`income overlap-group ${activeButton === 'income' ? 'active' : ''} ${
            pressedButton === 'income' ? 'pressed' : ''
          }`}
          onClick={() => handleClick('income')}
          onMouseUp={handleButtonRelease}
        >
          <div className="text-wrapper">Income</div>
        </div>
      </div>
      <div className="choose-nav">
        <div
          className={`expense overlap-group ${activeButton === 'expense' ? 'active' : ''} ${
            pressedButton === 'expense' ? 'pressed' : ''
          }`}
          onClick={() => handleClick('expense')}
          onMouseUp={handleButtonRelease}
        >
          <div className="text-wrapper">Expense</div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
