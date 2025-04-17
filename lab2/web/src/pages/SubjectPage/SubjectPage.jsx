import React from 'react';
import { useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import Post from '../../components/Post/Post';
import './SubjectPage.css';

const SubjectPage = () => {
  const { subjectName } = useParams();
  const posts = useSelector(state => 
    state.posts.items.filter(post => post.subject === subjectName)
  );

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