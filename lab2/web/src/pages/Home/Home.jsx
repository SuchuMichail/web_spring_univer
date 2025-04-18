import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addSubject, deleteSubject, getSubjects } from '../../redux/slices/subjectsSlice';
import Subject from '../../components/Subject/Subject';
import AddSubjectModal from '../../components/AddSubjectModal/AddSubjectModal';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import './Home.css';

const Home = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState(null);
  
  const dispatch = useDispatch();
  const { isAdmin } = useSelector(state => state.auth);
  const subjects = useSelector(state => state.subjects.list);
  const status = useSelector(state => state.subjects.status);

  console.log("SUBJECTSSSSS\n");
          console.log(subjects);

  const handleAddSubject = (subjectName) => {
    dispatch(addSubject(subjectName));
    setShowAddModal(false);
  };

  const handleDeleteClick = (subjectId) => {  // Принимаем только ID
    setSubjectToDelete(subjectId);
    setShowConfirmModal(true);
  };

  const confirmDelete = () => {
    dispatch(deleteSubject(subjectToDelete));
    setShowConfirmModal(false);
  };

  // Загрузка предметов при монтировании
  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const result = await dispatch(getSubjects()).unwrap();
        console.log('Успешно загружено:', result);
      } catch (err) {
//        console.error('Ошибка загрузки предметов:', err);
        console.error('Ошибка загрузки:', {
          message: err.message,
          response: err.response?.data
        });
      }
    };
    loadSubjects();
  }, [dispatch]);
  
  useEffect(() => {
    console.log('Current subjects:', subjects);
  }, [subjects]);
  
  return (
    <div className="home">
      <section className="subjects-section">
        <div className="section-header">
          <h2>Учебные предметы</h2>
          {isAdmin && (
            <button 
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary"
            >
              Добавить предмет
            </button>
          )}
        </div>
        


        <div className="subjects-grid">
          {status === 'loading' ? (
              <div>Загрузка...</div>
            ) : ((subjects || []).map((subject) => ( // Защита от undefined
                <Subject 
                  key={subject.id} 
                  subject={subject} 
                  onDelete={isAdmin ? () => handleDeleteClick(subject.id) : null} 
                />
          ))
        )}
        </div>
      </section>

      {showAddModal && (
        <AddSubjectModal 
          onClose={() => setShowAddModal(false)} 
          onAddSubject={handleAddSubject} 
        />
      )}

      {showConfirmModal && (
        <ConfirmModal
          message={`Вы уверены, что хотите удалить предмет "${subjectToDelete}"?`}
          onConfirm={confirmDelete}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </div>
  );
};

export default Home;