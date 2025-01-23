import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import { searchPosts, searchSubreddits, setActiveTab, setSortBy } from './searchSlice';
import VoteButtons from '../posts/VoteButtons';
import PostPreview from '../posts/PostPreview';
import SortOptions from '../../components/SortOptions/SortOptions';
import './Search.css';

const Search = () => {
  const dispatch = useDispatch();
  const { searchTerm, searchResults, subredditResults, activeTab, currentSort, isLoading, error } = useSelector((state) => state.search);
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize from URL params
  useEffect(() => {
    const queryType = searchParams.get('type') || 'posts';
    const querySort = searchParams.get('sort') || 'relevance';
    
    if (queryType !== activeTab) {
      dispatch(setActiveTab(queryType));
    }
    if (querySort !== currentSort) {
      dispatch(setSortBy(querySort));
    }
  }, [searchParams]);

  // Handle tab change
  const handleTabChange = (tab) => {
    dispatch(setActiveTab(tab));
    setSearchParams({ q: searchTerm, type: tab, sort: currentSort });
  };

  // Handle sort change
  const handleSortChange = (sortBy) => {
    dispatch(setSortBy(sortBy));
    setSearchParams({ q: searchTerm, type: activeTab, sort: sortBy });
  };

  // Perform search when params change
  useEffect(() => {
    if (searchTerm) {
      if (activeTab === 'posts') {
        dispatch(searchPosts({ searchTerm, sortBy: currentSort }));
      } else {
        dispatch(searchSubreddits(searchTerm));
      }
    }
  }, [searchTerm, activeTab, currentSort, dispatch]);

  const renderSearchResults = () => {
    if (activeTab === 'posts') {
      return searchResults.map((post) => (
        <div key={post.id} className="search-result-item">
          <VoteButtons post={post} />
          <Link 
            to={`/r/${post.subreddit}/comments/${post.id}`}
            className="search-result-link"
          >
            <div className="search-result-content">
              <h3>{post.title}</h3>
              <div className="search-result-meta">
                <span>Posted by u/{post.author}</span>
                <span>in r/{post.subreddit}</span>
              </div>
              <PostPreview post={post} />
              <div className="search-result-stats">
                <span>{post.comments} comments</span>
              </div>
            </div>
          </Link>
        </div>
      ));
    } else {
      return subredditResults.map((subreddit) => (
        <Link
          key={subreddit.name}
          to={`/r/${subreddit.name}`}
          className="search-result-item subreddit-item"
        >
          {subreddit.icon && (
            <img
              src={subreddit.icon}
              alt={`r/${subreddit.name} icon`}
              className="subreddit-icon"
            />
          )}
          <div className="search-result-content">
            <h3>r/{subreddit.name}</h3>
            <div className="search-result-meta">
              <span>{subreddit.subscribers?.toLocaleString()} members</span>
            </div>
            {subreddit.description && (
              <p className="search-result-excerpt">
                {subreddit.description.slice(0, 150)}
                {subreddit.description.length > 150 ? '...' : ''}
              </p>
            )}
          </div>
        </Link>
      ));
    }
  };

  return (
    <div className="search-container">
      <div className="search-tabs">
        <button
          className={`tab-button ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => handleTabChange('posts')}
        >
          Posts
        </button>
        <button
          className={`tab-button ${activeTab === 'communities' ? 'active' : ''}`}
          onClick={() => handleTabChange('communities')}
        >
          Communities
        </button>
      </div>

      {activeTab === 'posts' && searchTerm && (
        <SortOptions 
          currentSort={currentSort} 
          onSortChange={handleSortChange}
        />
      )}

      {isLoading && (
        <div className="search-status">Searching...</div>
      )}

      {error && (
        <div className="search-error">Error: {error}</div>
      )}

      {((activeTab === 'posts' && searchResults.length > 0) || 
        (activeTab === 'communities' && subredditResults.length > 0)) && (
        <div className="search-results">
          {renderSearchResults()}
        </div>
      )}

      {searchTerm && 
        ((activeTab === 'posts' && searchResults.length === 0) || 
         (activeTab === 'communities' && subredditResults.length === 0)) && 
        !isLoading && !error && (
        <div className="search-status">No results found</div>
      )}
    </div>
  );
};

export default Search; 