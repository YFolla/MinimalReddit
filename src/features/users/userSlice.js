import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchUserPosts = createAsyncThunk(
  'user/fetchUserPosts',
  async ({ username, sortBy = 'new' }) => {
    const response = await fetch(`https://www.reddit.com/user/${username}.json?sort=${sortBy}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user posts');
    }
    const data = await response.json();
    return data.data.children.map((post) => ({
      id: post.data.id,
      title: post.data.title,
      author: post.data.author,
      subreddit: post.data.subreddit,
      score: post.data.score,
      comments: post.data.num_comments,
      permalink: post.data.permalink,
      url: post.data.url,
      created: post.data.created_utc,
      likes: null,
      selftext: post.data.selftext,
      is_video: post.data.is_video,
      media: post.data.media,
      post_hint: post.data.post_hint,
      thumbnail: post.data.thumbnail,
      preview: post.data.preview,
      gallery_data: post.data.gallery_data,
      media_metadata: post.data.media_metadata,
      secure_media_embed: post.data.secure_media_embed,
      crosspost_parent_list: post.data.crosspost_parent_list,
    }));
  }
);

const initialState = {
  userPosts: [],
  isLoading: false,
  error: null,
  currentSort: 'new',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setSortBy(state, action) {
      state.currentSort = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userPosts = action.payload;
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { setSortBy } = userSlice.actions;

export default userSlice.reducer; 