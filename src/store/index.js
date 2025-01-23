import { configureStore } from '@reduxjs/toolkit';
import subredditsReducer from './subredditsSlice';
import postsReducer from './postsSlice';

const store = configureStore({
  reducer: {
    subreddits: subredditsReducer,
    posts: postsReducer,
  },
});

export default store; 