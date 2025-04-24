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
        postId: post.id,
        userId: user.id
      }));
    }
  };

  /*console.log('Post data:', post);
console.log('LikedBy:', post.likedBy);
console.log('User:', user);*/

  return (
    <Link to={`/post/${post.id}`} className="post-card">
      <div className="post-content">
        <h3 className="post-title">{post.title}</h3>
        <div className="post-footer">
          <span className="post-author">{post.author}</span>
          <button 
            onClick={handleLike}
            className={`like-btn ${isLiked ? 'liked' : ''}`}
            disabled={!user}
          >
            {isLiked ? '♥' : '♡'} {post.likes}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default Post;