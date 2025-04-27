import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, register } from '../../redux/slices/authSlice';
import './AuthModal.css';

const AuthModal = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    login: '',
    password: '',
    username: '',
    university: '',
    userGroup: ''
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try{
      if(isLogin){
        await dispatch(login({
          login: formData.login,
          password: formData.password
        }));
      }
      else{
        await dispatch(register({
          login: formData.login,
          password: formData.password,
          username: formData.username,
          university: formData.university,
          userGroup: formData.userGroup
        }));
        
        setIsLogin(true); // Переключаем на форму входа после регистрации
      }
    } catch (err) {
      console.error('Ошибка:', err);
    }
  };
  
  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal-container">
        <button className="auth-modal-close-btn" onClick={onClose}>×</button>
        <h2>{isLogin ? 'Вход в систему' : 'Регистрация'}</h2>
        
        {error && (
          <div className="auth-error">
            {typeof error === 'object' 
              ? error.message || 'Произошла ошибка при регистрации'
              : error}
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

          {!isLogin && (
            <>
              <div className="form-group">
                <label>Имя пользователя</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Университет</label>
                <input
                  type="text"
                  name="university"
                  value={formData.university}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Группа</label>
                <input
                  type="text"
                  name="userGroup"
                  value={formData.userGroup}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}
          
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