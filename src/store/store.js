import { configureStore } from '@reduxjs/toolkit';
import postsReducer from '../features/posts/postsSlice';
import subredditsReducer from '../features/subreddits/subredditsSlice';
import subredditReducer from '../features/subreddits/subredditSlice';
import searchReducer from '../features/search/searchSlice';
import commentsReducer from '../features/comments/commentsSlice';
import userReducer from '../features/users/userSlice';

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    subreddits: subredditsReducer,
    subreddit: subredditReducer,
    search: searchReducer,
    comments: commentsReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store; 