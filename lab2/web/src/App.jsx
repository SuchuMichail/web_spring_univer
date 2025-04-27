import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import SubjectPage from './pages/SubjectPage/SubjectPage';
import PostPage from './pages/PostPage/PostPage';
import Profile from './pages/Profile/Profile';
import './App.css';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Проверяем наличие токена при загрузке приложения
    const token = localStorage.getItem('authToken');
    if (token) {
      // Здесь можно добавить запрос для проверки токена
      // и получения данных пользователя
      console.log("I Have Token");
    }
  }, [dispatch]);


  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/subject/:subjectId" element={<SubjectPage />} />
          <Route path="/post/:postId" element={<PostPage />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;