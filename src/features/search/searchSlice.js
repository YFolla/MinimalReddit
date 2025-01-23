import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const searchPosts = createAsyncThunk(
  'search/searchPosts',
  async ({ searchTerm, sortBy = 'relevance' }) => {
    if (!searchTerm || searchTerm.trim().length === 0) {
      return [];
    }
    const response = await fetch(`https://www.reddit.com/search.json?q=${encodeURIComponent(searchTerm)}&sort=${sortBy}&limit=25`);
    if (!response.ok) {
      throw new Error('Failed to fetch search results');
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

export const searchSubreddits = createAsyncThunk(
  'search/searchSubreddits',
  async (searchTerm) => {
    if (!searchTerm || searchTerm.trim().length === 0) {
      return [];
    }
    const response = await fetch(`https://www.reddit.com/api/subreddit_autocomplete_v2.json?query=${encodeURIComponent(searchTerm)}&include_over_18=false`);
    if (!response.ok) {
      throw new Error('Failed to fetch subreddit results');
    }
    const data = await response.json();
    return data.data.children.map((subreddit) => ({
      name: subreddit.data.display_name,
      subscribers: subreddit.data.subscribers,
      icon: subreddit.data.icon_img || subreddit.data.community_icon,
      description: subreddit.data.public_description,
    }));
  }
);

const initialState = {
  searchTerm: '',
  searchResults: [],
  subredditResults: [],
  activeTab: 'posts',
  currentSort: 'relevance',
  isLoading: false,
  error: null,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchTerm(state, action) {
      state.searchTerm = action.payload;
    },
    clearSearch(state) {
      state.searchTerm = '';
      state.searchResults = [];
      state.subredditResults = [];
      state.error = null;
    },
    setActiveTab(state, action) {
      state.activeTab = action.payload;
    },
    setSortBy(state, action) {
      state.currentSort = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(searchSubreddits.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchSubreddits.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subredditResults = action.payload;
      })
      .addCase(searchSubreddits.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { setSearchTerm, clearSearch, setActiveTab, setSortBy } = searchSlice.actions;

export default searchSlice.reducer; 