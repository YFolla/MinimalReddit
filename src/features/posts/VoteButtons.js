import React from 'react';
import { useDispatch } from 'react-redux';
import { toggleUpvote, toggleDownvote } from './postsSlice';
import './VoteButtons.css';

const VoteButtons = ({ post }) => {
  const dispatch = useDispatch();

  const handleUpvote = (e) => {
    e.preventDefault(); // Prevent link click in Home view
    dispatch(toggleUpvote(post.id));
  };

  const handleDownvote = (e) => {
    e.preventDefault(); // Prevent link click in Home view
    dispatch(toggleDownvote(post.id));
  };

  return (
    <div className="vote-buttons">
      <button
        className={`vote-button upvote ${post.likes === true ? 'active' : ''}`}
        onClick={handleUpvote}
        aria-label="Upvote"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path d="M12 4L3 15h6v5h6v-5h6L12 4z" />
        </svg>
      </button>
      <span className="vote-score">{post.score}</span>
      <button
        className={`vote-button downvote ${post.likes === false ? 'active' : ''}`}
        onClick={handleDownvote}
        aria-label="Downvote"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path d="M12 20l9-11h-6V4H9v5H3l9 11z" />
        </svg>
      </button>
    </div>
  );
};

export default VoteButtons; 