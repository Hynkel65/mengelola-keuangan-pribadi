import React, { useContext } from 'react';
import { GlobalContext } from './context/GlobalState';
const Header = () => {
  const { user } = useContext(GlobalContext);
  return (
    <div className="header">
      <div className="header-title">
        Selamat Datang <br/><span className="user">{user}</span>
      </div>
    </div>
  );
};
export default Header;