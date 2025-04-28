import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addSubject, getSubjects } from '../../redux/slices/subjectsSlice';
import './AddSubjectModal.css';

const AddSubjectModal = ({ onClose }) => {
  const [subjectName, setSubjectName] = useState('');
  const dispatch = useDispatch();
  const { isAdmin } = useSelector(state => state.auth);
  const { status, error } = useSelector(state => state.subjects);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAdmin) {
      alert('Требуются права администратора');
      return;
    }

    if(!subjectName.trim()) return;

    try {
      await dispatch(addSubject(subjectName)).unwrap();

      // Явно запрашиваем обновленный список
      await dispatch(getSubjects());

      setSubjectName(''); // Очищаем поле ввода
      onClose(); // Закрываем модалку после успешного добавления
    } catch (err) {
      console.error('Ошибка добавления:', err);
    }
  };

  return (
    <div className="sub_modal-overlay">
      <div className="sub_modal-content">
        <h2>Добавить предмет</h2>
        {status === 'failed' && <div className="error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            placeholder="Название предмета"
            required
          />
          
          <div className="sub_modal-actions">
            <button type="button" onClick={onClose}>Отмена</button>
            <button type="submit" disabled={status === 'loading'}>
              {status === 'loading' ? 'Добавление...' : 'Добавить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSubjectModal;