import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addSubject, deleteSubject } from '../../redux/slices/subjectsSlice';
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

  const handleAddSubject = (subjectName) => {
    dispatch(addSubject(subjectName));
    setShowAddModal(false);
  };

  const handleDeleteClick = (subjectName) => {
    setSubjectToDelete(subjectName);
    setShowConfirmModal(true);
  };

  const confirmDelete = () => {
    dispatch(deleteSubject(subjectToDelete));
    setShowConfirmModal(false);
  };

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
          {subjects.map((subject, index) => (
            <Subject 
              key={index} 
              name={subject} 
              onDelete={isAdmin ? () => handleDeleteClick(subject) : null} 
            />
          ))}
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