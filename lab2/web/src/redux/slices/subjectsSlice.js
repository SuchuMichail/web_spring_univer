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
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const subjectsSlice = createSlice({
  name: 'subject',
  initialState: {
    list: [],
    status: 'idle'
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addSubject.fulfilled, (state, action) => {
        state.list.push(action.payload);
        state.status = 'succeeded';
      })
      .addCase(addSubject.rejected, (state, action) => {
        //state.error = action.payload;
        state.status = 'failed';
        state.error = action.payload?.message || action.error?.message || 'Ошибка добавления предмета';
      })

      .addCase(deleteSubject.fulfilled, (state, action) => {
        // Удаляем предмет из состояния по ID
        state.list = state.list.filter(subject => subject.id !== action.payload);
      })
      .addCase(deleteSubject.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(getSubjects.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getSubjects.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(getSubjects.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      });
  }
  /*reducers: {
      getSubjects: (state, action) => {
        state.list = action.payload;
      },
      addSubject: (state, action) => {
        state.list.push(action.payload);
      },
      deleteSubject: (state, action) => {
        state.list = state.list.filter(subject => subject.id !== action.payload);
      }
  }*/
});

//export const { getSubjects, addSubject, deleteSubject } = subjectsSlice.actions;
export default subjectsSlice.reducer;