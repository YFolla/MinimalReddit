import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async ({ subreddit, postId }) => {
    const response = await fetch(`https://www.reddit.com/r/${subreddit}/comments/${postId}.json`);
    const data = await response.json();
    const comments = data[1].data.children.map(comment => ({
      id: comment.data.id,
      author: comment.data.author,
      body: comment.data.body,
      score: comment.data.score,
      created: comment.data.created_utc,
      replies: comment.data.replies ? comment.data.replies.data.children
        .filter(reply => reply.kind === 't1')
        .map(reply => ({
          id: reply.data.id,
          author: reply.data.author,
          body: reply.data.body,
          score: reply.data.score,
          created: reply.data.created_utc,
        })) : [],
    }));
    return comments;
  }
);

const initialState = {
  comments: [],
  isLoading: false,
  error: null,
};

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    clearComments(state) {
      state.comments = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearComments } = commentsSlice.actions;

export default commentsSlice.reducer; 