import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import SubjectPage from './pages/SubjectPage/SubjectPage';
import PostPage from './pages/PostPage/PostPage';
import Profile from './pages/Profile/Profile';
import './App.css';

function App() {
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