import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { fetchPostsBySubjectId } from '../../redux/slices/postsSlice';
import Post from '../../components/Post/Post';
import './SubjectPage.css';

const SubjectPage = () => {
  const { subjectId } = useParams();
  const dispatch = useDispatch();
  
  const {
    postsBySubject,
    status,
    error
  } = useSelector(state => state.posts);
  
  const subjects = useSelector(state => state.subjects.list);
  const currentSubject = subjects.find(subj => subj.id === Number(subjectId));
  const reversedPosts = [...postsBySubject].reverse();

  console.log("reversedPosts = \n",reversedPosts)

  const subjectName = currentSubject?.subjectName || reversedPosts[0]?.subject?.subjectName || 'Неизвестный предмет';

  useEffect(() => {
    dispatch(fetchPostsBySubjectId(subjectId));
  }, [dispatch, subjectId]);

  // Добавим отладочную информацию
  console.log('Posts data:', postsBySubject);
  console.log('Subject ID:', subjectId);
  console.log('Status:', status);

  

  if (status === 'loading') {
    return <div className="loading">Загрузка...</div>;
  }

  if (error) {
    return <div className="error">Ошибка: {error}</div>;
  }

  return (
    <div className="subject-page">
      <div className="container">
        <div className="page-header">
          <h1>{subjectName}</h1>
          <Link to="/" className="btn btn-outline">Назад</Link>
        </div>
        
        <div className="posts-list">
          {Array.isArray(reversedPosts) && reversedPosts.length > 0 ? (
            reversedPosts.map(post => (
              <div key={post.post.id} className="post-wrapper">
                <Post post={post} />
              </div>
            ))
          ) : (
            <p className="no-posts">
              {status === 'succeeded' 
                ? "Нет постов по этому предмету" 
                : "Не удалось загрузить посты"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubjectPage;