import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/slices/authSlice';
import { fetchUserPosts } from '../../redux/slices/postsSlice';
import Post from '../../components/Post/Post';
import CreatePostModal from '../../components/CreatePostModal/CreatePostModal';
import AuthModal from '../../components/AuthModal/AuthModal';
import './Profile.css';

const Profile = () => {
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const posts = useSelector(state => state.posts.items);
  
  //const userPosts = user ? posts.filter(post => post.author === user.id) : [];
  //const likedPosts = user ? posts.filter(post => post.likedBy?.includes(user.id)) : [];

  const userPosts = user?.userPosts || [];
  const likedPosts = user?.likedPosts || [];

  console.log("user = ", user)

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  useEffect(() => {
    console.log("RENDERRRRRRRRRRR\n",user)

    if (user?.id) {
      dispatch(fetchUserPosts(user.id));
    }
  }, [dispatch, user]);

  if (showAuthModal) {
    return <AuthModal onClose={() => setShowAuthModal(false)} />;
  }

  const sortedUserPosts = [...userPosts].sort((a, b) => {
    // Если есть дата создания
    /*if (a.createdAt && b.createdAt) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }*/

    // Иначе сортируем по ID (предполагаем, что новые посты имеют больший ID)
    return b.id - a.id;
  });

  if (!user) {
    return (
      <div className="profile">
        <div className="container">
          <div className="auth-required">
            <h2>Для доступа к личному кабинету необходимо авторизоваться</h2>
            <button 
              onClick={() => setShowAuthModal(true)}
              className="btn btn-primary"
            >
              Войти
            </button>
          </div>
        </div>
      </div>
    );
  }

  

  return (
    <div className="profile">
      <div className="container">
        <div className="profile-header">
          <h1>Личный кабинет</h1>
          <button onClick={handleLogout} className="btn btn-danger">Выйти</button>
        </div>
        
        <div className="user-info">
          <div className="info-card">
            <h2 className="info-title">Основная информация</h2>
            <p><span className="info-label">Имя:</span> {user.username || user.login}</p>
            <p><span className="info-label">Университет:</span> {user.university || 'Не указан'}</p>
            <p><span className="info-label">Группа:</span> {user.userGroup || 'Не указана'}</p>
            {user.isAdmin && <p className="admin-badge">Администратор</p>}
          </div>
        </div>

        <div className="create-post-section">
          <button 
            onClick={() => setShowCreatePostModal(true)}
            className="btn btn-primary create-post-btn"
          >
            Создать пост
          </button>
          {showCreatePostModal && (
            <CreatePostModal onClose={() => setShowCreatePostModal(false)} />
          )}
        </div>
        
        <div className="user-posts-section">
          <h2>Мои публикации ({sortedUserPosts.length})</h2>
          {sortedUserPosts.length > 0 ? (
            <div className="posts-list">
              {sortedUserPosts.map(post => (
                <Post key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <p className="no-posts-message">У вас пока нет публикаций</p>
          )}
        </div>
        
        <div className="liked-posts-section">
          <h2>Понравившиеся публикации ({likedPosts.length})</h2>
          {likedPosts.length > 0 ? (
            <div className="posts-list">
              {likedPosts.map(post => (
                <Post key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <p className="no-posts-message">Вы еще не лайкнули ни одного поста</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;