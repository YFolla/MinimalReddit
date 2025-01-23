import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (sortBy = 'hot') => {
    const response = await fetch(`https://www.reddit.com/${sortBy}.json`);
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
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
  posts: [],
  selectedPost: null,
  isLoading: false,
  error: null,
  currentSort: 'hot',
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setSelectedPost(state, action) {
      state.selectedPost = action.payload;
    },
    setSortBy(state, action) {
      state.currentSort = action.payload;
    },
    toggleUpvote(state, action) {
      const postId = action.payload;
      const post = state.posts.find((p) => p.id === postId);
      if (post) {
        post.likes = post.likes ? null : true;
        post.score = post.likes ? post.score + 1 : post.score - 1;
      }
    },
    toggleDownvote(state, action) {
      const postId = action.payload;
      const post = state.posts.find((p) => p.id === postId);
      if (post) {
        post.likes = post.likes === false ? null : false;
        post.score = post.likes === false ? post.score + 1 : post.score - 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  setSelectedPost,
  setSortBy,
  toggleUpvote,
  toggleDownvote,
} = postsSlice.actions;

export default postsSlice.reducer; 