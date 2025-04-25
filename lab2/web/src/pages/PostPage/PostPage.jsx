import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleLike, addPost } from '../../redux/slices/postsSlice';
import { downloadFile, fetchPostById, fetchUserPosts  } from '../../api/api';
import './PostPage.css';

const PostPage = () => {
  const { postId } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const post = useSelector(state => 
    state.posts.items.find(p => String(p.id) === String(postId))
  );

  console.log("POST = \n",post)

  const [downloadingFile, setDownloadingFile] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    //if (!post && postId) {
      const loadPost = async () => {
        try {
          setIsLoading(true);
          const response = await fetchPostById(postId); 
          const normalizedPost = {
            ...response.post,
            subject: response.subject || {id: null, subjectName: 'Неизвестно'},
            author: response.author || null,
            files: response.files || [],
            likedBy: response.likedBy || []
          };

          console.log("NORM POST = \n",normalizedPost)
          dispatch(addPost(normalizedPost)); // Сохраняем пост в Redux

          console.log("Я добавил post")
        } catch (err) {
          console.error('Ошибка загрузки поста:', err);
        } finally {
          setIsLoading(false);
        }
      };
      if (!post?.files?.length) { // Загружаем, если нет файлов
        loadPost();
      }
      //loadPost();
   // }
  }, [postId, post, dispatch]);

  if (isLoading) {
    return <div>Загрузка поста...</div>;
  }

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

  console.log("post.files?.length > 0",post.files?.length > 0)
  console.log("post = \n",post)

  return (
    <div className="post-page">
      <div className="post-header">
        <span className="post-subject">{post.subject.subjectName}</span>
        <h1>{post.title}</h1>
        <p className="post-author">Автор: {post.author?.username || 'Неизвестен'}</p>
      </div>

      <div className="post-content">
        <p>{post.text}</p>
      </div>
      
      {Array.isArray(post.files) && post.files.length > 0 && (
        <div className="post-files">
          <h3>Прикрепленные файлы:</h3>
          {error && <div className="error-message">{error}</div>}
          <ul className="files-list">
            {post.files.map((file, index) => {
              console.log("I TRY TO SHOW THIS POST\n",post);
              console.log("file = \n",file);
              console.log("downloadingFile = \n",downloadingFile);
              return (
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
            )})}
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
        <Link to={post.subject?.id ? `/subject/${post.subject.id}` : '#'} className="btn btn-outline">
          К предмету
        </Link>
      </div>
    </div>
  );
};

export default PostPage;