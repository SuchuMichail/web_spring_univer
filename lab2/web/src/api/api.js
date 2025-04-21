import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true, // Для отправки кук/сессий
  headers: {
    'Content-Type': 'application/json',
  }
});

const fileAPI = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true, // Для отправки кук/сессий
  headers: {
    'Content-Type': 'multipart/form-data',
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
export const deleteUser = (userId) => API.delete(`/user/${userId}`);

export const fetchUserPosts = (userId) => API.get(`/api/user/${userId}/getPosts`);

export const loginUser = (credentials) => 
  API.post('/api/user/login', credentials)
    .then(response => {
      console.log('Полный ответ сервера:', response);
      console.log("userData ",response.data.user)
      // Если сервер возвращает null при неудачной аутентификации
      if (response.data === null) {
        throw new Error('Неверный логин или пароль');
      }
      if (!response.data?.user) { // Проверяем наличие userData
        throw new Error('Неверный логин или пароль');
      }
      return response.data;
    })
    .catch(error => {
      console.error('Ошибка входа:', error);
      if (error.response && error.response.status === 401) {
        throw new Error('Неверный логин или пароль');
      }
      throw error;
    });



// Post endpoints
export const addPost = (formData) => fileAPI.post('/api/post/addPost', formData);


export const fetchPostById = (postId) => API.get(`/api/post/${postId}`)
    .then(response => response.data);

export const fetchPostsBySubjectId = (subjectId) => 
  API.get(`/api/post/fetchPostsBySubjectId/${subjectId}`)
    .then(response => {
      console.log("REEEEESPONSEEE DATA = \n",response.data)
      return response.data;});


export const deletePost = (postId) => API.delete(`/post/${postId}`);
export const downloadFile = (postId, fileId) => API.get(`/post/${postId}/files/${fileId}`, 
  { responseType: 'blob' }
);



// Subject endpoints
export const addSubject = (subjectName) => 
  API.post('/api/subject/addSubject', {subjectName})                                
      .then(response => {
        const data = response.data.subject; // Извлекаем subjectData;
        console.log('data: ', data);
        return data;
      }); 

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


// Admin check
export const checkAdmin = (userId) => API.get(`/user/${userId}/admin`);