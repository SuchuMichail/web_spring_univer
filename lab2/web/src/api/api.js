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
export const addSubject = (subjectName) => 
  API.post('/api/subject/addSubject', {subjectName})                                
      .then(response => {
        const data = response.data.subjectData; // Извлекаем subjectData;
        console.log('data: ', data);
        return data;
      }); 
/*
export const getSubjects = () => API.get('/api/subject/getSubjects')
                                    .then(response => 
                                      response.data
                                    );*/
export const getSubjects = () => 
  API.get('/api/subject/getSubjects')
      .then(response => {
        if (!response.data) {
          console.error('Сервер вернул пустые данные');
          return [];
        }
        // Извлекаем subject из каждого элемента массива
        const subjects = response.data.map(item => item.subject || {});
        console.log('Нормализованные предметы:', subjects);
        return subjects;
      })
      .catch(error => {
        console.error('Ошибка при нормализации:', error);
        throw error; // Важно пробросить ошибку дальше
      });;

export const deleteSubject = (subjectId) => {
  if (!subjectId) {
    console.error('Попытка удаления без ID');
    return Promise.reject(new Error('ID предмета не указан'));
  }
  return API.delete(`/api/subject/deleteSubject/${subjectId}`);
};

/*API.delete(`/api/subject/deleteSubject/${subjectId}`, { 
    data: { / здесь параметры для DeleteSubjectRequest / }
  });*/

// Admin check
export const checkAdmin = (userId) => API.get(`/user/${userId}/admin`);