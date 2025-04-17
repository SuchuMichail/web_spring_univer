import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleLike } from '../../redux/slices/postsSlice';
import { downloadFile } from '../../api/api';
import './PostPage.css';

const PostPage = () => {
  const { postId } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const post = useSelector(state => 
    state.posts.items.find(p => p.id === parseInt(postId))
  );
  const [downloadingFile, setDownloadingFile] = useState(null);
  const [error, setError] = useState(null);

  if (!post) {
    return (
      <div className="post-not-found">
        <h2>Пост не найден</h2>
        <Link to="/" className="btn btn-primary">На главную</Link>
      </div>
    );
  }

  const isLiked = user && post.likedBy.includes(user.id);

  const handleLike = () => {
    if (user) {
      dispatch(toggleLike({
        postId: post.id,
        userId: user.id
      }));
    }
  };

  const handleFileDownload = async (fileId, fileName) => {
    setDownloadingFile(fileName);
    setError(null);
    
    try {
      const response = await downloadFile(post.id, fileId);
      
      // Создаем временную ссылку для скачивания
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      
      // Очистка
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);

    } catch (err) {
      console.error('Ошибка загрузки файла:', err);
      setError('Не удалось загрузить файл. Попробуйте позже.');
    } finally {
      setDownloadingFile(null);
    }
  };

  return (
    <div className="post-page">
      <div className="post-header">
        <span className="post-subject">{post.subject}</span>
        <h1>{post.title}</h1>
        <p className="post-author">Автор: {post.author?.name || 'Неизвестен'}</p>
      </div>

      <div className="post-content">
        <p>{post.text}</p>
      </div>

      {post.files?.length > 0 && (
        <div className="post-files">
          <h3>Прикрепленные файлы:</h3>
          {error && <div className="error-message">{error}</div>}
          <ul className="files-list">
            {post.files.map((file, index) => (
              <li 
                key={file.id || index}
                className={`file-item ${downloadingFile === file.name ? 'downloading' : ''}`}
                onClick={() => handleFileDownload(file.id, file.name)}
              >
                <span className="file-icon">
                  {file.type?.startsWith('image/') ? '🖼️' : '📄'}
                </span>
                <span className="file-name">{file.name}</span>
                {file.size && (
                  <span className="file-size">
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                )}
                {downloadingFile === file.name && (
                  <span className="download-spinner">⏳</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="post-actions">
        <button 
          onClick={handleLike}
          className={`like-btn ${isLiked ? 'liked' : ''}`}
          disabled={!user}
        >
          {isLiked ? '♥' : '♡'} {post.likes}
        </button>
        <Link to={`/subject/${post.subject}`} className="btn btn-outline">
          Назад к предмету
        </Link>
      </div>
    </div>
  );
};

export default PostPage;