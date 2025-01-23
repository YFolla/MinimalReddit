import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserPosts, setSortBy } from './userSlice';
import PostPreview from '../posts/PostPreview';
import VoteButtons from '../posts/VoteButtons';
import SortOptions from '../../components/SortOptions/SortOptions';
import { Link } from 'react-router-dom';
import './UserProfile.css';

const UserProfile = () => {
  const { username } = useParams();
  const dispatch = useDispatch();
  const { userPosts, isLoading, error, currentSort } = useSelector((state) => state.user);

  useEffect(() => {
    if (username) {
      dispatch(fetchUserPosts({ username, sortBy: currentSort }));
    }
  }, [dispatch, username, currentSort]);

  const handleSortChange = (sortBy) => {
    dispatch(setSortBy(sortBy));
  };

  if (isLoading) {
    return <div className="loading">Loading user profile...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="user-profile">
      <div className="user-header">
        <h1>u/{username}'s posts</h1>
      </div>

      <div className="user-content">
        <SortOptions 
          currentSort={currentSort}
          onSortChange={handleSortChange}
          options={['new', 'hot', 'top']}
        />

        <div className="user-posts">
          {userPosts.map((post) => (
            <div key={post.id} className="post-wrapper">
              <VoteButtons post={post} />
              <Link 
                to={`/r/${post.subreddit}/comments/${post.id}`}
                className="post-link"
              >
                <div className="post-card">
                  <h2>{post.title}</h2>
                  <div className="post-meta">
                    <span>Posted in r/{post.subreddit}</span>
                    <span>{post.score} points</span>
                  </div>
                  <PostPreview post={post} />
                  <div className="post-stats">
                    <span>{post.comments} comments</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}

          {userPosts.length === 0 && !isLoading && (
            <div className="no-posts">
              No posts found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 