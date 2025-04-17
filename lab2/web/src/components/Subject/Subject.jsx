import React from 'react';
import { Link } from 'react-router-dom';
import './Subject.css';
import { useDispatch, useSelector } from 'react-redux';
import { deleteSubject } from '../../redux/slices/subjectsSlice';

const Subject = ({ subject }) => { // Получаем subject через пропсы
  const dispatch = useDispatch();
  const { isAdmin } = useSelector(state => state.auth);
  const { status } = useSelector(state => state.subjects);

  const subjects = useSelector(state => state.subjects.list);
  console.log(subjects); // Проверьте структуру данных

  const handleDelete = async () => {
    if (!isAdmin) {
      alert('Требуются права администратора');
      return;
    }

    if (window.confirm(`Удалить предмет "${subject.subjectName}"?`)) {
      try {
        await dispatch(deleteSubject(subject.id)).unwrap();
      } catch (err) {
        console.error('Ошибка удаления:', err);
      }
    }
  };

  return (
    <div className="subject-card">
      <h3>{subject.subjectName}</h3>
      {isAdmin && (
        <button 
          onClick={handleDelete}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Удаление...' : 'Удалить'}
        </button>
      )}
    </div>
  );
};

export default Subject;