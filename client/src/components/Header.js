//import React from 'react';
import React, { useContext } from 'react';
import { GlobalContext } from './context/GlobalState';

const Header = () => {
  const { user } = useContext(GlobalContext);

  //const user = "Rafi Zahran"

  return (
    <div className="header">
      <div className="header-title">
        Welcome, <span className="user">{user}</span>
      </div>
    </div>
  );
};

export default Header;
