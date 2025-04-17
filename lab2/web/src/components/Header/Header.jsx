import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../../redux/slices/authSlice';
import './Header.css';

const Header = () => {
  const dispatch = useDispatch();
  const { user, isAdmin } = useSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <Link to="/" className="logo">Учебная платформа</Link>
        </div>
        
        <div className="header-right">
          <nav className="nav">
            {user ? (
              <>
                <Link to="/profile" className="btn btn-primary nav-btn">Личный кабинет</Link>
                <button onClick={handleLogout} className="btn btn-outline nav-btn">Выйти</button>
              </>
            ) : (
              <Link to="/profile" className="btn btn-primary nav-btn">Личный кабинет</Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;