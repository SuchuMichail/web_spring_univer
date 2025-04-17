import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess, registerSuccess } from '../../redux/slices/authSlice';
import './AuthModal.css';

const AuthModal = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    university: '',
    group: ''
  });
  
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isLogin) {
      dispatch(loginSuccess({
        name: formData.name,
        password: formData.password
      }));
    } else {
      dispatch(registerSuccess({
        name: formData.name,
        university: formData.university,
        group: formData.group,
        password: formData.password
      }));
    }
    
    onClose();
  };

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal-container">
        <button 
          className="auth-modal-close-btn"
          onClick={onClose}
          aria-label="Закрыть окно"
        >
          <span className="auth-modal-close-icon">×</span>
        </button>

        <h2 className="auth-modal-title">
          {isLogin ? 'Вход в аккаунт' : 'Регистрация'}
        </h2>

        <form onSubmit={handleSubmit} className="auth-modal-form">
          <div className="auth-input-group">
            <label htmlFor="auth-name">Логин</label>
            <input
              id="auth-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              autoComplete="username"
            />
          </div>

          <div className="auth-input-group">
            <label htmlFor="auth-password">Пароль</label>
            <input
              id="auth-password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete={isLogin ? "current-password" : "new-password"}
            />
          </div>

          {!isLogin && (
            <>
              <div className="auth-input-group">
                <label htmlFor="auth-university">Университет</label>
                <input
                  id="auth-university"
                  type="text"
                  name="university"
                  value={formData.university}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="auth-input-group">
                <label htmlFor="auth-group">Группа</label>
                <input
                  id="auth-group"
                  type="text"
                  name="group"
                  value={formData.group}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}

          <div className="auth-modal-actions">
            <button 
              type="submit" 
              className="auth-modal-submit-btn"
            >
              {isLogin ? 'Войти' : 'Зарегистрироваться'}
            </button>

            <button
              type="button"
              className="auth-modal-switch-btn"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Создать новый аккаунт' : 'Уже есть аккаунт? Войти'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;