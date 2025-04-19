import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addPost } from '../../redux/slices/postsSlice';
import { getSubjects } from '../../redux/slices/subjectsSlice';
import './CreatePostModal.css';

const CreatePostModal = ({ onClose }) => {
  const [postData, setPostData] = useState({
    subject: '',
    title: '',
    text: '',
    files: []
  });
  const [previews, setPreviews] = useState([]);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const subjects = useSelector(state => state.subjects.list);
  const { user } = useSelector(state => state.auth);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map(file => ({
      name: file.name,
      type: file.type.startsWith('image/') ? 'image' : 'other',
      url: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    }));
    
    setPostData(prev => ({
      ...prev,
      files: [...prev.files, ...files]
    }));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeFile = (index) => {
    const newFiles = [...postData.files];
    const newPreviews = [...previews];
    
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setPostData(prev => ({ ...prev, files: newFiles }));
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Здесь должна быть реализация загрузки файлов на сервер
    // Для примера просто добавляем пост с информацией о файлах
    const formData = new FormData();
    postData.files.forEach(file => formData.append('files', file));
    
    dispatch(addPost({
      subject: postData.subject,
      title: postData.title,
      text: postData.text,
      author: user.name,
      files: postData.files.map(file => ({
        name: file.name,
        type: file.type,
        size: file.size
      })),
      likes: 0,
      likedBy: []
    }));
    
    onClose();
  };

  useEffect(() => {
    console.log('Subjects data:', subjects); // Проверьте структуру данных
  }, [subjects]);

  useEffect(() => {
    dispatch(getSubjects());
  }, [dispatch]);  

  return (
    <div className="modal-overlay">
      <div className="modal-content create-post-modal">
        <button className="modal-close" onClick={onClose}>×</button>
        <h2 className="modal-title">Создать новый пост</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="postSubject">Предмет</label>
            <select
              id="postSubject"
              name="subject"
              value={postData.subject}
              onChange={(e) => setPostData({...postData, subject: e.target.value})}
              required
            >
              <option value="">Выберите предмет</option>
              {subjects.map(subject => (
                <option 
                  key={subject.id} 
                  value={subject.subjectName}
                >
                  {subject.subjectName}
                </option>
              ))}
            </select>
          </div>
          
          <div className="input-group">
          <label htmlFor="postTitle">Название поста</label>
          <input
            id="postTitle"
            type="text"
            name="title"
            value={postData.title}
            onChange={(e) => setPostData({...postData, title: e.target.value})}
            placeholder="Введите название поста"
            required
          />
          </div>

          <div className="input-group">
            <label htmlFor="postText">Текст поста</label>
            <textarea
              id="postText"
              name="text"
              value={postData.text}
              onChange={(e) => setPostData({...postData, text: e.target.value})}
              placeholder="Введите текст вашего поста..."
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="postFiles">Прикрепленные файлы</label>
            <input
              id="postFiles"
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
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="btn btn-primary">
              Опубликовать
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;