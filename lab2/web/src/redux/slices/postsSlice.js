import { createSlice } from '@reduxjs/toolkit';
import { createPost, getPosts, deletePost } from '../../api/api';

const postsSlice = createSlice({
  name: 'post',
  initialState: {
    items: [],
    status: 'idle'
  },
  reducers: {
    // Явно экспортируем редьюсеры
    addPost: (state, action) => {
      const newPost = {
        id: state.items.length + 1,
        title: action.payload.title, // Убедитесь, что title передается
        text: action.payload.text,
        subject: action.payload.subject,
        author: action.payload.author,
        files: action.payload.files || [],
        likes: 0,
        likedBy: []
      };
      state.items.push(newPost);
    },
    toggleLike: (state, action) => {
      const post = state.items.find(p => p.id === action.payload.postId);
      if (post) {
        const index = post.likedBy.indexOf(action.payload.userId);
        if (index === -1) {
          post.likedBy.push(action.payload.userId);
          post.likes += 1;
        } else {
          post.likedBy.splice(index, 1);
          post.likes -= 1;
        }
      }
    }
  }
});

export const { addPost, toggleLike } = postsSlice.actions;
export default postsSlice.reducer;