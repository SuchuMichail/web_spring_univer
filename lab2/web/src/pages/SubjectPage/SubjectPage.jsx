import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import { useParams, Link } from 'react-router-dom';
import { getSubjects } from '../../redux/slices/subjectsSlice';

import Post from '../../components/Post/Post';
import './SubjectPage.css';

// Вынесем селектор отдельно
const selectPosts = state => state.posts.items;
const selectSubjects = state => {
    console.log("ARARARARAR: ",state.subjects.list)
    return state.subjects.list;
}

// Мемоизированный селектор для постов
const makeSelectPostsBySubject = subjectName => createSelector(
  [selectPosts],
  posts => posts.filter(post => post.subject === subjectName)
);

// Мемоизированный селектор для названия предмета
const makeSelectSubjectName = subjectId => createSelector(
  [selectSubjects],
  subjects => {
    const numSubjectId = Number(subjectId);
    const subject = subjects.find(subj => {
      return subj.id === numSubjectId});

    console.log("SUBJ: ",subject)
    return subject ? subject.subjectName : 'Неизвестный предмет';
  }
);

const SubjectPage = () => {
  const { subjectId } = useParams();
  const dispatch = useDispatch();

  // Получаем посты
  const selectPostsBySubject = useMemo(
    () => makeSelectPostsBySubject(subjectId),
    [subjectId]
  );
  const posts = useSelector(selectPostsBySubject);

  console.log('Subject id from URL:', subjectId); 


  // Получаем название предмета
  const selectSubjectName = useMemo(
    () => makeSelectSubjectName(subjectId),
    [subjectId]
  );
  const subjectName = useSelector(selectSubjectName);
  
  useEffect(() => {
    dispatch(getSubjects());
  }, [dispatch]);  

  return (
    <div className="subject-page">
      <div className="container">
        <div className="page-header">
          <h1>{subjectName}</h1>
          <Link to="/" className="btn btn-outline">Назад</Link>
        </div>
        
        <div className="posts-list">
          {posts.map(post => (
            <Post key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubjectPage;