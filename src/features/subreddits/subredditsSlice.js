import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchSubreddits = createAsyncThunk(
  'subreddits/fetchSubreddits',
  async () => {
    const response = await fetch('https://www.reddit.com/subreddits/popular.json');
    const data = await response.json();
    return data.data.children.map((subreddit) => ({
      id: subreddit.data.id,
      name: subreddit.data.display_name,
      url: subreddit.data.url,
      icon: subreddit.data.icon_img || subreddit.data.community_icon,
      subscribers: subreddit.data.subscribers,
      description: subreddit.data.public_description,
    }));
  }
);

const initialState = {
  subreddits: [],
  followedSubreddits: [],
  isLoading: false,
  error: null,
};

const subredditsSlice = createSlice({
  name: 'subreddits',
  initialState,
  reducers: {
    followSubreddit(state, action) {
      const subreddit = action.payload;
      if (!state.followedSubreddits.some(sub => sub.name === subreddit.name)) {
        state.followedSubreddits.push(subreddit);
      }
    },
    unfollowSubreddit(state, action) {
      const subredditName = action.payload;
      state.followedSubreddits = state.followedSubreddits.filter(
        (subreddit) => subreddit.name !== subredditName
      );
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubreddits.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSubreddits.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subreddits = action.payload;
      })
      .addCase(fetchSubreddits.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { followSubreddit, unfollowSubreddit } = subredditsSlice.actions;

export default subredditsSlice.reducer; 