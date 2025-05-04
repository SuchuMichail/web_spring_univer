import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleLike, addPost } from '../../redux/slices/postsSlice';
import { downloadFile, fetchPostById, fetchUserPosts  } from '../../api/api';
import './PostPage.css';

const PostPage = () => {
  const { postId } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector(state => {
    //console.log("Current state:", JSON.stringify(state, null, 2));
    return state.auth;});

  const post = useSelector(state => 
    state.posts.items.find(p => String(p.post.id) === String(postId))
  );

  console.log("POST = \n",post)

  const [downloadingFile, setDownloadingFile] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
      const loadPost = async () => {
        try {
          //setIsLoading(true);
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
      // Загружаем пост если:
      // 1. Его нет в хранилище ИЛИ
      // 2. Он есть, но не загружены файлы (проверяем по наличию files в ответе API)
     // if (!post || (post && post.files && post.files.length === 0 && !post.filesLoaded)) {
        loadPost();
     // }
      //if (!post?.files?.length) { // Загружаем, если нет файлов
      //  loadPost();
      //}
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
      const response = await downloadFile(postId, fileId);
      
      // Создаем временную ссылку для скачивания
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      
      // Очистка
     // setTimeout(() => {
    //    document.body.removeChild(link);
    //    URL.revokeObjectURL(url);
    //  }, 100);
    // Очистка
      link.parentNode.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (err) {
      console.error('Ошибка загрузки файла:', err);
      setError('Не удалось загрузить файл. Попробуйте позже.');
    } finally {
      setDownloadingFile(null);
    }
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return '🖼️';
    if (fileType.includes('pdf')) return '📕';
    if (fileType.includes('word')) return '📄';
    if (fileType.includes('excel')) return '📊';
    if (fileType.includes('zip')) return '🗜️';
    return '📁';
  };

  console.log("post.files?.length > 0",post.files?.length > 0)
  console.log("post = \n",post)

  return (
    <div className="post-page_page">
      <div className="post-page_header">
        <span className="post-page_subject">{post.subject.subjectName}</span>
        <h1>{post.post.title}</h1>
        <p className="post-page_author">Автор: {post.author?.username || 'Неизвестен'}</p>
      </div>

      <div className="post-page_content">
        <p>{post.post.text}</p>
      </div>
      
      {Array.isArray(post.files) && post.files.length > 0 && (
        <div className="post-page_files">
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
                  {getFileIcon(file.type)}
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

      <div className="post-page_actions">
        {/*<button 
          onClick={handleLike}
          className={`like-btn ${isLiked ? 'liked' : ''}`}
          disabled={!user}
        >
          {isLiked ? '♥' : '♡'} {post.likes}
        </button>*/}
        <Link to={post.subject?.id ? `/subject/${post.subject.id}` : '#'} className="btn btn-outline">
          К предмету
        </Link>
      </div>
    </div>
  );
};

export default PostPage;