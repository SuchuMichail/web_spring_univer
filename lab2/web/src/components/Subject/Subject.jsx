import React from 'react';
import './Subject.css';
import { useDispatch, useSelector } from 'react-redux';
import { deleteSubject } from '../../redux/slices/subjectsSlice';

const Subject = ({ subject }) => { // Получаем subject через пропсы subject = {id, subjectName}
  const dispatch = useDispatch();
  const { isAdmin } = useSelector(state => state.auth);
  const { status } = useSelector(state => state.subjects);
  const subjects = useSelector(state => state.subjects.list);

  if (!subject) return null; // Защита от undefined
  console.log('Полученные данные:', subject);

  console.log(subjects); // Проверьте структуру данных

  console.log("SUBJECT\n")
  console.log(subject)

  // Проверяем новую структуру
  const actualSubject = subject.subject || subject;

  const handleDelete = async () => {
    if (!isAdmin) {
      alert('Требуются права администратора');
      return;
    }

    if (!actualSubject?.id) { 
      console.log("subject: ", subject)
      console.log(subject.subject.id)
      console.error('ID предмета не определён:', subject);
      return;
    }
    
    console.log('Данные предмета перед удалением:', {
      id: actualSubject.id,
      name: actualSubject.subjectName
    });

    if (window.confirm(`Удалить предмет "${actualSubject.subjectName}"?`)) {
      try {
        await dispatch(deleteSubject(actualSubject.id)).unwrap();
      } catch (err) {
        console.error('Ошибка удаления:', err);
      }
    }
  };

  return (
    <div className="subject-card">
      <h3>{actualSubject?.subjectName || "Название не указано"}</h3>
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