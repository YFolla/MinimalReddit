import React from 'react';
import './PostPreview.css';

const PostPreview = ({ post }) => {
  const getMediaContent = () => {
    // Handle image posts
    if (post.post_hint === 'image') {
      const imageUrl = post.preview?.images[0]?.source?.url?.replace(/&amp;/g, '&');
      return (
        <div className="post-media-container">
          <img 
            src={imageUrl} 
            alt={post.title}
            className="post-image"
            loading="lazy"
          />
        </div>
      );
    }

    // Handle gallery posts
    if (post.gallery_data && post.media_metadata) {
      const firstImageId = post.gallery_data.items[0]?.media_id;
      if (firstImageId && post.media_metadata[firstImageId]) {
        const imageUrl = post.media_metadata[firstImageId].s.u?.replace(/&amp;/g, '&');
        return (
          <div className="post-media-container">
            <img 
              src={imageUrl} 
              alt={post.title}
              className="post-image"
              loading="lazy"
            />
            {post.gallery_data.items.length > 1 && (
              <div className="gallery-indicator">
                +{post.gallery_data.items.length - 1} more
              </div>
            )}
          </div>
        );
      }
    }

    // Handle embedded videos/media
    if (post.secure_media_embed?.media_domain_url) {
      return (
        <div className="post-media-container">
          <div className="video-placeholder">
            <div className="video-icon">▶</div>
            <span>Video content</span>
          </div>
        </div>
      );
    }

    // Handle text posts
    if (post.selftext) {
      return (
        <div className="post-text-preview">
          <p>
            {post.selftext.slice(0, 300)}
            {post.selftext.length > 300 ? '...' : ''}
          </p>
        </div>
      );
    }

    // Handle link posts
    if (post.post_hint === 'link') {
      return (
        <div className="post-link-preview">
          {post.thumbnail && post.thumbnail !== 'default' && (
            <img 
              src={post.thumbnail} 
              alt="Link thumbnail"
              className="link-thumbnail"
              loading="lazy"
            />
          )}
          <div className="link-info">
            <span className="link-domain">{new URL(post.url).hostname}</span>
            <span className="link-url">{post.url}</span>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="post-preview">
      {getMediaContent()}
    </div>
  );
};

export default PostPreview; 