import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true, // Для отправки кук/сессий
  headers: {
    'Content-Type': 'application/json',
  }
});

// Добавьте обработку CORS ошибок
API.interceptors.response.use(
  response => {
    console.log('Ответ сервера:', response.data);
    return response;
  },
  error => {
    if (error.message === 'Network Error' && !error.response) {
      error.message = 'Проблемы с соединением или CORS';
    }

    console.error('Ошибка запроса:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data
    });

    return Promise.reject(error);
  }
);

// User endpoints
export const registerUser = (userData) => API.post('/user/register', userData);
export const loginUser = (credentials) => API.post('/user/login', credentials);
export const deleteUser = (userId) => API.delete(`/user/${userId}`);

// Post endpoints
export const createPost = (postData) => API.post('/post', postData);
export const getPosts = () => API.get('/post');
export const deletePost = (postId) => API.delete(`/post/${postId}`);
export const downloadFile = (postId, fileId) => API.get(`/post/${postId}/files/${fileId}`, 
  { responseType: 'blob' }
);

// Subject endpoints
export const addSubject = (subjectName) => API.post('/api/subject/addSubject', {subjectName});
/*
export const addSubject = (subjectName) => 
  axios.post('http://localhost:8080/api/subject/addSubject', 
    { subjectName },
    { 
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' }
    }
  );*/

export const getSubjects = () => API.get('/api/subject/getSubjects');
export const deleteSubject = (subjectId) => API.delete(`/api/subject/deleteSubject/${subjectId}`);

// Admin check
export const checkAdmin = (userId) => API.get(`/user/${userId}/admin`);