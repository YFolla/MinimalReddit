import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchComments } from '../comments/commentsSlice';
import VoteButtons from './VoteButtons';
import ReactMarkdown from 'react-markdown';
import './PostDetail.css';

const PostDetail = () => {
  const { subreddit, postId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { posts } = useSelector((state) => state.posts);
  const { searchResults } = useSelector((state) => state.search);
  const { comments, isLoading: commentsLoading, error: commentsError } = useSelector((state) => state.comments);

  // Try to find the post in both posts and search results
  const post = posts.find(p => p.id === postId) || searchResults.find(p => p.id === postId);

  useEffect(() => {
    if (subreddit && postId) {
      dispatch(fetchComments({ subreddit, postId }));
    }
  }, [dispatch, subreddit, postId]);

  const handleBack = () => {
    navigate(-1);
  };

  const renderMedia = () => {
    if (!post) return null;

    // Handle image posts
    if (post.post_hint === 'image') {
      return (
        <div className="post-media">
          <img src={post.url} alt={post.title} />
        </div>
      );
    }

    // Handle video posts
    if (post.is_video && post.media) {
      return (
        <div className="post-media">
          <video controls>
            <source 
              src={post.media.reddit_video.fallback_url} 
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    // Handle gallery posts
    if (post.gallery_data && post.media_metadata) {
      return (
        <div className="post-gallery">
          {post.gallery_data.items.map((item) => {
            const metadata = post.media_metadata[item.media_id];
            if (metadata && metadata.s) {
              return (
                <div key={item.media_id} className="gallery-item">
                  <img 
                    src={metadata.s.u || metadata.s.gif} 
                    alt={`Gallery item ${item.media_id}`}
                  />
                </div>
              );
            }
            return null;
          })}
        </div>
      );
    }

    // Handle link posts with thumbnails
    if (post.thumbnail && post.thumbnail !== 'self' && post.thumbnail !== 'default') {
      return (
        <div className="post-link-with-thumbnail">
          <a href={post.url} target="_blank" rel="noopener noreferrer">
            <img src={post.thumbnail} alt="Post thumbnail" />
            <span className="link-url">{post.url}</span>
          </a>
        </div>
      );
    }

    // Handle crossposted content
    if (post.crosspost_parent_list && post.crosspost_parent_list[0]) {
      const crosspost = post.crosspost_parent_list[0];
      return (
        <div className="crosspost">
          <div className="crosspost-header">
            <span>Crossposted from r/{crosspost.subreddit}</span>
          </div>
          <div className="crosspost-content">
            {crosspost.selftext && (
              <div className="post-text">
                <ReactMarkdown>{crosspost.selftext}</ReactMarkdown>
              </div>
            )}
            {crosspost.url && !crosspost.url.includes('reddit.com') && (
              <div className="post-link">
                <a href={crosspost.url} target="_blank" rel="noopener noreferrer">
                  {crosspost.url}
                </a>
              </div>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  if (!post) {
    return <div className="error">Post not found</div>;
  }

  return (
    <div className="post-detail">
      <button onClick={handleBack} className="back-button">
        ← Back
      </button>
      <article className="post-content">
        <div className="post-content-wrapper">
          <VoteButtons post={post} />
          <div className="post-main-content">
            <h1>{post.title}</h1>
            <div className="post-meta">
              <span>
                Posted by{' '}
                <Link to={`/user/${post.author}`} className="meta-link">
                  u/{post.author}
                </Link>
              </span>
              <span>
                in{' '}
                <Link to={`/r/${post.subreddit}`} className="meta-link">
                  r/{post.subreddit}
                </Link>
              </span>
            </div>
            
            {post.selftext && (
              <div className="post-text">
                <ReactMarkdown>{post.selftext}</ReactMarkdown>
              </div>
            )}
            
            {renderMedia()}

            <div className="post-stats">
              <span>{post.comments} comments</span>
            </div>
          </div>
        </div>
      </article>

      <section className="comments-section">
        <h2>Comments</h2>
        {commentsLoading && <div className="loading">Loading comments...</div>}
        {commentsError && <div className="error">Error loading comments: {commentsError}</div>}
        {comments.map((comment) => (
          <div key={comment.id} className="comment">
            <div className="comment-meta">
              <Link to={`/user/${comment.author}`} className="comment-author">
                u/{comment.author}
              </Link>
              <span className="comment-score">{comment.score} points</span>
            </div>
            <div className="comment-body">
              <ReactMarkdown>{comment.body}</ReactMarkdown>
            </div>
            {comment.replies && comment.replies.length > 0 && (
              <div className="comment-replies">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="comment reply">
                    <div className="comment-meta">
                      <Link to={`/user/${reply.author}`} className="comment-author">
                        u/{reply.author}
                      </Link>
                      <span className="comment-score">{reply.score} points</span>
                    </div>
                    <div className="comment-body">
                      <ReactMarkdown>{reply.body}</ReactMarkdown>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </section>
    </div>
  );
};

export default PostDetail; 