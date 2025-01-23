import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSubredditPosts, fetchSubredditInfo, setSortBy } from './subredditSlice';
import PostPreview from '../posts/PostPreview';
import VoteButtons from '../posts/VoteButtons';
import SortOptions from '../../components/SortOptions/SortOptions';
import { Link } from 'react-router-dom';
import './Subreddit.css';

const Subreddit = () => {
  const { subredditName } = useParams();
  const dispatch = useDispatch();
  const { posts, subredditInfo, isLoading, error, currentSort } = useSelector((state) => state.subreddit);

  useEffect(() => {
    if (subredditName) {
      dispatch(fetchSubredditInfo(subredditName));
      dispatch(fetchSubredditPosts({ subredditName, sortBy: currentSort }));
    }
  }, [dispatch, subredditName, currentSort]);

  const handleSortChange = (sortBy) => {
    dispatch(setSortBy(sortBy));
  };

  if (isLoading && !subredditInfo) {
    return <div className="loading">Loading subreddit...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="subreddit">
      {subredditInfo && (
        <div className="subreddit-header">
          {subredditInfo.banner && (
            <div className="subreddit-banner">
              <img src={subredditInfo.banner} alt={`r/${subredditName} banner`} />
            </div>
          )}
          <div className="subreddit-info">
            {subredditInfo.icon && (
              <img 
                src={subredditInfo.icon} 
                alt={`r/${subredditName} icon`}
                className="subreddit-icon"
              />
            )}
            <div className="subreddit-details">
              <h1>{subredditInfo.title || `r/${subredditName}`}</h1>
              <div className="subreddit-stats">
                <span>{subredditInfo.subscribers?.toLocaleString()} members</span>
              </div>
              {subredditInfo.description && (
                <p className="subreddit-description">{subredditInfo.description}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="subreddit-content">
        <SortOptions 
          currentSort={currentSort}
          onSortChange={handleSortChange}
        />

        <div className="subreddit-posts">
          {posts.map((post) => (
            <div key={post.id} className="post-wrapper">
              <VoteButtons post={post} />
              <Link 
                to={`/r/${post.subreddit}/comments/${post.id}`}
                className="post-link"
              >
                <div className="post-card">
                  <h2>{post.title}</h2>
                  <div className="post-meta">
                    <span>Posted by u/{post.author}</span>
                  </div>
                  <PostPreview post={post} />
                  <div className="post-stats">
                    <span>{post.comments} comments</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}

          {posts.length === 0 && !isLoading && (
            <div className="no-posts">
              No posts found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Subreddit; 