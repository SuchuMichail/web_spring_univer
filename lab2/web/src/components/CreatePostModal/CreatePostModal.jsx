import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addPost, fetchUserPosts } from '../../redux/slices/postsSlice';
import { getSubjects } from '../../redux/slices/subjectsSlice';
import { useNavigate } from 'react-router-dom';
import { addPost as apiAddPost } from '../../api/api';
import './CreatePostModal.css';

const CreatePostModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    subjectId: '',
    text: '',
    files: []
  });
  
  const [previews, setPreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  //const [subjectsLoaded, setSubjectsLoaded] = useState(false);
  
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  ///const subjects = useSelector(state => state.subjects.list);
  const { list: subjects, status: subjectsStatus } = useSelector(state => state.subjects);
  const { user } = useSelector(state => state.auth);

  // Загрузка предметов при открытии модалки
  useEffect(() => {
    if (subjectsStatus === 'idle') {
      dispatch(getSubjects());
    }
  }, [dispatch, subjectsStatus]);

  // Обработчики изменений
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Обработка файлов
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const newPreviews = newFiles.map(file => ({
      name: file.name,
      type: file.type.startsWith('image/') ? 'image' : 'other',
      url: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      file
    }));

    setFormData(prev => ({...prev,files: [...prev.files, ...newFiles]}));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeFile = (index) => {
    const newFiles = [...formData.files];
    const newPreviews = [...previews];
    
    // Освобождаем память от URL превью
    if (newPreviews[index]?.url) {
      URL.revokeObjectURL(newPreviews[index].url);
    }
    
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setFormData({ ...formData, files: newFiles });
    setPreviews(newPreviews);
  };

  // Очистка превью при закрытии модалки
  useEffect(() => {
    return () => {
      previews.forEach(preview => {
        if (preview.url) URL.revokeObjectURL(preview.url);
      });
    };
  }, [previews]);



  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.subjectId) {
      setError('Выберите предмет');
      return;
    }
  
    setIsLoading(true);
    setError(null);
  
    try {
      // 1. Подготовка данных
      const selectedSubject = subjects.find(subj => subj.id == formData.subjectId);
      if (!selectedSubject) {
        throw new Error('Предмет не найден');
      }
      console.log("IM Here")
  
      // 2. Формируем FormData
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('text', formData.text);
      
      // Важно: отправляем только ID для subject и author
      formDataToSend.append('subjectId', selectedSubject.id);
      formDataToSend.append('authorId', user.id);
  
      // Добавляем файлы с проверкой размера
      if (formData.files?.length > 0) {
        formData.files.forEach(file => {
          if (file.size > 10 * 1024 * 1024) { // 10MB лимит
            throw new Error(`Файл ${file.name} слишком большой (макс. 10MB)`);
          }
          formDataToSend.append('files', file);
        });
      }
  
      console.log('Отправляемые данные:');
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, value);
      }
  
      // 4. Отправка
      const response = await apiAddPost(formDataToSend);

      if (!response.data) {
        throw new Error('Пустой ответ от сервера');
      }

      console.log("User: ",user)
      
      console.log("I catch response data", response.data)
      console.log("I catch response data post id", response.data.post.id)
      // 5. Обработка успешного ответа
      dispatch(addPost({
        post: {
          id: response.data.post.id,
          title: response.data.post.title,
          text: response.data.post.text
        },
        subject: selectedSubject,
        author: user,
        likes: 0,
        likedBy: [],
        files: response.data.files || []
      }));

      

      // Принудительно обновляем посты пользователя
      await dispatch(fetchUserPosts(user.id));
  
      onClose();
    } catch (err) {
      console.error('Ошибка:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Ошибка при создании поста');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content create-post-modal">
        <button className="modal-close" onClick={onClose}>×</button>
        <h2 className="modal-title">Создать новый пост</h2>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="postSubject">Предмет*</label>
            <select
              id="postSubject"
              name="subjectId"
              value={formData.subjectId}
              onChange={handleInputChange}
              required
              disabled={subjectsStatus === 'loading'}
            >
              <option value="">Выберите предмет</option>
              {subjects.map(subject => (
                <option key={subject.id} value={subject.id}>
                  {subject.subjectName}
                </option>
              ))}
            </select>
            {subjectsStatus === 'loading' && <div className="loading-indicator">Загрузка предметов...</div>}
          </div>
          
          <div className="input-group">
            <label htmlFor="postTitle">Название поста*</label>
            <input
              id="postTitle"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Введите название поста"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="postText">Текст поста</label>
            <textarea
              id="postText"
              name="text"
              value={formData.text}
              onChange={handleInputChange}
              placeholder="Введите текст вашего поста..."
              rows={5}
            />
          </div>

          <div className="input-group">
            <label>Прикрепленные файлы</label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              style={{ display: 'none' }}
            />
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => fileInputRef.current.click()}
            >
              Добавить файлы
            </button>
            
            <div className="file-previews">
              {previews.map((preview, index) => (
                <div key={index} className="file-preview">
                  {preview.type === 'image' ? (
                    <img src={preview.url} alt={preview.name} className="preview-image" />
                  ) : (
                    <div className="file-icon">
                      <span className="file-extension">
                        {preview.name.split('.').pop()}
                      </span>
                    </div>
                  )}
                  <div className="file-info">
                    <span className="file-name">{preview.name}</span>
                    <button
                      type="button"
                      className="remove-file-btn"
                      onClick={() => removeFile(index)}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="modal-actions">
            <button 
              type="button" 
              className="btn btn-outline" 
              onClick={onClose}
              disabled={isLoading}
            >
              Отмена
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isLoading || subjectsStatus === 'loading'}
            >
              {isLoading ? 'Публикация...' : 'Опубликовать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;