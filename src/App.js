import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './components/Home/Home';
import Search from './features/search/Search';
import PostDetail from './features/posts/PostDetail';
import UserProfile from './features/users/UserProfile';
import Subreddit from './features/subreddits/Subreddit';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/r/:subreddit/comments/:postId" element={<PostDetail />} />
          <Route path="/user/:username" element={<UserProfile />} />
          <Route path="/r/:subredditName" element={<Subreddit />} />
        </Routes>
      </main>
    </div>
  );
}

export default App; 