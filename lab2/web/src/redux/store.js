import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import subjectsReducer from './slices/subjectsSlice';
import postsReducer from './slices/postsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    subjects: subjectsReducer,
    posts: postsReducer,
  },
});