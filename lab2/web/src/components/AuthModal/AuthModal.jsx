import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/slices/authSlice';
import { loginSuccess, registerSuccess } from '../../redux/slices/authSlice';
import './AuthModal.css';

const AuthModal = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    login: '',
    password: ''
  });
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, user } = useSelector(state => state.auth);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

   // Добавляем эффект для перенаправления после успешного входа
   useEffect(() => {
    if (user) {
      onClose(); // Закрываем модальное окно
      navigate('/profile'); // Перенаправляем в личный кабинет
    }
  }, [user, navigate, onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({
      login: formData.login, // Отправляем login
      password: formData.password
    }));
  };
  
  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal-container">
        <button className="auth-modal-close-btn" onClick={onClose}>×</button>
        <h2>{isLogin ? 'Вход в систему' : 'Регистрация'}</h2>
        
        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Логин</label>
            <input
              type="text"
              name="login"
              value={formData.login}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Пароль</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <button 
            type="submit" 
            disabled={status === 'loading'}
            className="login-btn"
          >
            {status === 'loading' ? (isLogin ? 'Вход...' : 'Регистрация...') : (isLogin ? 'Войти' : 'Зарегистрироваться')}
          </button>

          <button
            type="button"
            className="switch-mode-btn"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Создать новый аккаунт' : 'Уже есть аккаунт? Войти'}
          </button>
        </form>
      </div>
    </div>
  );

};

export default AuthModal;