import React, { useState } from 'react';

// Navigation component to handle button clicks and active states
const Navigation = ({ activeButton, handleButtonClick }) => {
  const [pressedButton, setPressedButton] = useState('');

  // Handles button click events
  const handleClick = (buttonName) => {
    handleButtonClick(buttonName); // Call parent handler
    setPressedButton(buttonName);  // Set the pressed button state
  };

  // Resets the pressed button state on mouse release
  const handleButtonRelease = () => {
    setPressedButton('');
  };

  // Render method for Navigation component
  return (
    <div className="navigation">
      {[
        { name: 'dashboard', label: 'Dashboard' },
        { name: 'analisis', label: 'Analisis' },
        { name: 'riwayat', label: 'Riwayat' },
        { name: 'pendapatan', label: 'Pendapatan' },
        { name: 'pengeluaran', label: 'Pengeluaran' },
      ].map(({ name, label }) => (
        <div key={name} className="choose-nav">
          <div
            className={`overlap-group ${name} ${
              activeButton === name ? 'active' : ''
            } ${pressedButton === name ? 'pressed' : ''}`}
            onClick={() => handleClick(name)}
            onMouseUp={handleButtonRelease}
          >
            <div className="text-wrapper">{label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Navigation;