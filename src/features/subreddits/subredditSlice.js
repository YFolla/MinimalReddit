import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchSubredditPosts = createAsyncThunk(
  'subreddit/fetchSubredditPosts',
  async ({ subredditName, sortBy = 'hot' }) => {
    const response = await fetch(`https://www.reddit.com/r/${subredditName}/${sortBy}.json`);
    if (!response.ok) {
      throw new Error('Failed to fetch subreddit posts');
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

export const fetchSubredditInfo = createAsyncThunk(
  'subreddit/fetchSubredditInfo',
  async (subredditName) => {
    const response = await fetch(`https://www.reddit.com/r/${subredditName}/about.json`);
    if (!response.ok) {
      throw new Error('Failed to fetch subreddit info');
    }
    const data = await response.json();
    return {
      name: data.data.display_name,
      title: data.data.title,
      description: data.data.public_description,
      subscribers: data.data.subscribers,
      icon: data.data.icon_img || data.data.community_icon,
      banner: data.data.banner_background_image || data.data.banner_img,
      created: data.data.created_utc,
    };
  }
);

const initialState = {
  posts: [],
  subredditInfo: null,
  isLoading: false,
  error: null,
  currentSort: 'hot',
};

const subredditSlice = createSlice({
  name: 'subreddit',
  initialState,
  reducers: {
    setSortBy(state, action) {
      state.currentSort = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubredditPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSubredditPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload;
      })
      .addCase(fetchSubredditPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(fetchSubredditInfo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSubredditInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subredditInfo = action.payload;
      })
      .addCase(fetchSubredditInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { setSortBy } = subredditSlice.actions;

export default subredditSlice.reducer; 