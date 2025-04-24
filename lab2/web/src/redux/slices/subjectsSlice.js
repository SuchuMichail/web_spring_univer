import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { 
  getSubjects as apiGetSubjects,
  addSubject as apiAddSubject,
  deleteSubject as apiDeleteSubject 
} from '../../api/api'; 

export const addSubject = createAsyncThunk(
  'subject/addSubject',
  async (subjectName, { rejectWithValue }) => {
    try {
      const response = await apiAddSubject(subjectName);
      console.log('Ответ сервера при добавлении:', response.data);

      if (!response) {
        throw new Error('Пустой ответ от сервера');
      }
      
      return response.data; // Сервер должен вернуть созданный предмет
    } catch (err) {
      console.error('Ошибка запроса:', {
        message: err.message,
        response: err.response,
      });
      
      return rejectWithValue(err.response.data);
    }
  }
);

export const deleteSubject = createAsyncThunk(
  'subject/deleteSubject',
  async (subjectId, { rejectWithValue }) => {
    console.log('Пытаемся удалить предмет с ID:', subjectId);
    try {
      await apiDeleteSubject(subjectId); // Отправляем запрос на бэкенд
      return subjectId; // Возвращаем ID для удаления из состояния
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getSubjects = createAsyncThunk(
  'subject/getSubjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiGetSubjects();

      console.log("TRY GET SUBJECTS. RESPONSE: ", response)
      console.log('Формат данных от сервера:', response.data);

      if (!response) {
        throw new Error('Пустой ответ от сервера');
      }

      return response; // Возвращаем уже нормализованные данные
    } catch (err) {
      console.error('Ошибка в getSubjects:', err);
      return rejectWithValue(err.response.data);
    }
  }
);

const subjectsSlice = createSlice({
  name: 'subject',
  initialState: {
    list: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      
      //addSubject
      .addCase(addSubject.fulfilled, (state, action) => {
        //state.list.push(action.payload);
        if (action.payload) {
          /*state.list.push({
            id: action.payload.id,
            subjectName: action.payload.subjectName
          });*/
          state.list.push(action.payload);
          state.status = 'succeeded';
        }
        /*if (action.payload?.subjectData) {
          state.list.push({
            id: action.payload.subjectData.id,
            subjectName: action.payload.subjectData.subjectName
          });
          state.status = 'succeeded';
        }*/
      })
      .addCase(addSubject.rejected, (state, action) => {
        //state.error = action.payload;
        state.status = 'failed';
        state.error = action.payload?.message || action.error?.message || 'Ошибка добавления предмета';
      })


      //deleteSubject
      .addCase(deleteSubject.fulfilled, (state, action) => {
        // Удаляем предмет из состояния по ID
        state.list = state.list.filter(subject => subject.id !== action.payload);
      })
      .addCase(deleteSubject.rejected, (state, action) => {
        state.error = action.payload;
      })


      //getSubjects
      .addCase(getSubjects.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getSubjects.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(getSubjects.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = Array.isArray(action.payload) ? action.payload : [];
        console.log('Данные в хранилище:', state.list);
      });
  }
});

//export const { getSubjects, addSubject, deleteSubject } = subjectsSlice.actions;
export default subjectsSlice.reducer;