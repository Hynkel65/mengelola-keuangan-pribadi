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
      {[
        { name: 'dashboard', label: 'Dashboard' },
        { name: 'analisis', label: 'Analisis' },
        { name: 'riwayat', label: 'Riwayat' },
        { name: 'pemasukan', label: 'Pemasukan' },
        { name: 'pengeluaran', label: 'Pengeluaran' },
      ].map(({ name, label }) => (
        <div key={name} className="choose-nav">
          <div
            className={`overlap-group ${name} ${activeButton === name ? 'active' : ''
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