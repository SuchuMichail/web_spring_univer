import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toggleLike } from '../../redux/slices/postsSlice';
import './Post.css';

const Post = ({ post }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const isLiked = user && post.likedBy && post.likedBy.includes(user.id || user.name);

  const handleLike = (e) => {
    e.preventDefault();
    if (user) {
      dispatch(toggleLike({
        postId: post.post.id,
        userId: user.id
      }));
    }
  };

  // Получаем первые 30 символов текста поста
  const previewText = post.post.text ? 
    post.post.text.length > 30 ? 
      `${post.post.text.substring(0, 30)}...` : 
      post.post.text : 
    '';

  console.log('Post data FROM Redux:', post);
console.log('LikedBy:', post.likedBy);
console.log('post.post.id ', post.post.id);

  return (
    <Link to={`/post/${post.post.id}`} className="post-card">
      <div className="post-content">
        {/* Верхняя часть - автор */}
        <div className="post-author">
          {post.author?.username || 'Неизвестный автор'}
        </div>

        {/* Основной контент - заголовок (1/3 высоты) */}
        <h3 className="post-title">{post.post.title}</h3>

        {/* Нижняя часть - превью текста */}
        <div className="post-preview">
          {previewText}
        </div>

        {/* Футер - лайки */}
      {/*  <div className="post-footer">
          <button 
            onClick={handleLike}
            className={`like-btn ${isLiked ? 'liked' : ''}`}
            disabled={!user}
          >
            {isLiked ? '♥' : '♡'} {post.likes}
          </button>
        </div>*/}
      </div>
    </Link>
  );
};

export default Post;