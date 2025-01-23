import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { setSearchTerm, searchPosts, searchSubreddits } from '../../features/search/searchSlice';
import VoteButtons from '../../features/posts/VoteButtons';
import PostPreview from '../../features/posts/PostPreview';
import './SearchDropdown.css';

const SearchDropdown = () => {
  const dispatch = useDispatch();
  const { searchTerm, searchResults, subredditResults, isLoading } = useSelector((state) => state.search);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const dropdownRef = useRef(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch search results based on active tab
  useEffect(() => {
    if (debouncedTerm) {
      if (activeTab === 'posts') {
        dispatch(searchPosts({ searchTerm: debouncedTerm }));
      } else {
        dispatch(searchSubreddits(debouncedTerm));
      }
    }
  }, [debouncedTerm, activeTab, dispatch]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    dispatch(setSearchTerm(value));
    setShowDropdown(true);
  };

  const handleFocus = () => {
    setShowDropdown(true);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const renderSearchResults = () => {
    if (activeTab === 'posts') {
      return searchResults.slice(0, 5).map((post) => (
        <Link
          key={post.id}
          to={`/r/${post.subreddit}/comments/${post.id}`}
          className="search-result-item"
          onClick={() => setShowDropdown(false)}
        >
          <VoteButtons post={post} />
          <div className="search-result-content">
            <h3>{post.title}</h3>
            <div className="search-result-meta">
              <span>Posted by u/{post.author}</span>
              <span>in r/{post.subreddit}</span>
            </div>
            <PostPreview post={post} />
          </div>
        </Link>
      ));
    } else {
      return subredditResults.slice(0, 5).map((subreddit) => (
        <Link
          key={subreddit.name}
          to={`/r/${subreddit.name}`}
          className="search-result-item subreddit-item"
          onClick={() => setShowDropdown(false)}
        >
          {subreddit.icon && (
            <img
              src={subreddit.icon}
              alt={`r/${subreddit.name} icon`}
              className="subreddit-icon"
            />
          )}
          <div className="search-result-content">
            <h4>r/{subreddit.name}</h4>
            <span>{subreddit.subscribers?.toLocaleString()} members</span>
          </div>
        </Link>
      ));
    }
  };

  return (
    <div className="search-dropdown" ref={dropdownRef}>
      <div className="search-input-wrapper">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={handleFocus}
          placeholder="Search Reddit"
          aria-label="Search Reddit"
        />
        {searchTerm && showDropdown && (
          <button
            className="clear-search"
            onClick={() => {
              dispatch(setSearchTerm(''));
              setShowDropdown(false);
            }}
          >
            ×
          </button>
        )}
      </div>

      {showDropdown && searchTerm && (
        <div className="search-results-dropdown">
          <div className="search-tabs">
            <button
              className={`tab-button ${activeTab === 'posts' ? 'active' : ''}`}
              onClick={() => handleTabChange('posts')}
            >
              Posts
            </button>
            <button
              className={`tab-button ${activeTab === 'subreddits' ? 'active' : ''}`}
              onClick={() => handleTabChange('subreddits')}
            >
              Communities
            </button>
          </div>

          <div className="search-results-content">
            {isLoading ? (
              <div className="search-loading">Loading...</div>
            ) : (
              renderSearchResults()
            )}
          </div>

          {searchTerm && (
            <Link
              to={`/search?q=${encodeURIComponent(searchTerm)}&type=${activeTab}`}
              className="view-all-results"
              onClick={() => setShowDropdown(false)}
            >
              View all results for "{searchTerm}"
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchDropdown; 