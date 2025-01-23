import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchPosts, setSortBy } from '../../features/posts/postsSlice';
import VoteButtons from '../../features/posts/VoteButtons';
import PostPreview from '../../features/posts/PostPreview';
import SortOptions from '../SortOptions/SortOptions';
import './Home.css';

const Home = () => {
  const dispatch = useDispatch();
  const { posts, isLoading, error, currentSort } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(fetchPosts(currentSort));
  }, [dispatch, currentSort]);

  const handleSortChange = (sortBy) => {
    dispatch(setSortBy(sortBy));
  };

  if (isLoading) {
    return <div className="loading">Loading posts...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="home">
      <div className="posts-container">
        <SortOptions currentSort={currentSort} onSortChange={handleSortChange} />
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
                  <span>in r/{post.subreddit}</span>
                </div>
                <PostPreview post={post} />
                <div className="post-stats">
                  <span>{post.comments} comments</span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home; 