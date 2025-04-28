import axios from 'axios';
import { logout } from '../redux/slices/authSlice';
import { store } from '../redux/store';

const API = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true, // Для отправки кук/сессий
  headers: {
    'Content-Type': 'application/json',
  }
});

const fileAPI = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true, 
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});

const authAPI = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true,
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

    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('authToken');
      window.location.href = '/?authError=session_expired';
    }

    console.error('Ошибка запроса:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data
    });

    return Promise.reject(error);
  }
);


//Добавление токена в заголовки запросов:
authAPI.interceptors.request.use(config => {
    const token = localStorage.getItem('authToken');

    console.log("localStorage... ", localStorage)
    console.log("MY Token = ",token)

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log('Заголовки запроса:', config.headers);

    return config;
  }, error => {
  return Promise.reject(error);
});

fileAPI.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');

  console.log("localStorage... ", localStorage)
  console.log("MY Token = ",token)

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  console.log('Заголовки запроса:', config.headers);

  return config;
}, error => {
return Promise.reject(error);
});


/****************************************************************************************** */

// User endpoints
//export const deleteUser = (userId) => API.delete(`/user/${userId}`);

export const fetchUserPosts = (userId) => 
  authAPI.get(`/api/user/${userId}/getPosts`)
          .then(response => {
            console.log("fetchUserPosts response = ", response);
            return response;
          });

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

export const registerUser = async (userData) => {
  return API.post('/api/user/register', userData)
    .then(response => {
      const data = response.data; // Извлекаем subjectData;
      console.log('data: ', data);
      return response;
    })
    .catch(error => {
      // Преобразуем ошибку API в читаемый формат
      const apiError = error.response?.data;
      if (apiError) {
        throw new Error(
          apiError.message || 
          apiError.error || 
          'Ошибка регистрации'
        );
      }
      throw error;
    });
};

/***************************************************************************************** */

// Post endpoints
export const addPost = (formData) => fileAPI.post('/api/post/addPost', formData);


export const fetchPostById = (postId) => API.get(`/api/post/fetchPostById/${postId}`)
    .then(response => {
      console.log("(fetchPostById) Post data with files:", response.data);
      return response.data;
    });

export const fetchPostsBySubjectId = (subjectId) => 
  API.get(`/api/post/fetchPostsBySubjectId/${subjectId}`)
    .then(response => {
      console.log("REEEEESPONSEEE DATA = \n",response.data)
      return response.data;});


//export const deletePost = (postId) => API.delete(`/post/${postId}`);
export const downloadFile = (postId, fileId) => fileAPI.get(`/api/post/files/${fileId}`, 
  { responseType: 'blob' }
);


/********************************************************************************************** */

// Subject endpoints
export const addSubject = (subjectName) => 
  authAPI.post('/api/subject/addSubject', {subjectName})                                
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
  return authAPI.delete(`/api/subject/deleteSubject/${subjectId}`);
};


// Admin check
//export const checkAdmin = (userId) => API.get(`/user/${userId}/admin`);