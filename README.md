# Reddit Minimal

A simplified Reddit client built with React and Redux that focuses on providing a clean, minimalist browsing experience. This application uses the Reddit JSON API to fetch and display posts, comments, and subreddit information.

## Features

- **Browse Popular Posts**: View trending posts from Reddit's front page
- **Search Functionality**:
  - Real-time search suggestions
  - Search for posts and communities
  - Filter search results by relevance, hot, new, and top
  - Preview search results in a dropdown

- **Post Viewing**:
  - View post content (text, images, videos, galleries)
  - Display comments and replies
  - Show post metadata (author, subreddit, score, etc.)
  - Support for various post types (text, images, videos, links, galleries)
  - Upvote/downvote functionality

- **Subreddit Features**:
  - View subreddit information and posts
  - Display subreddit metadata (subscribers, description)
  - Sort subreddit posts by hot, new, and top

- **User Profiles**:
  - View user's posts
  - Sort user posts by new, hot, and top

- **Responsive Design**:
  - Mobile-friendly layout
  - Adaptive UI components
  - Optimized media loading

## Technologies Used

- **React**: Frontend library for building the user interface
- **Redux Toolkit**: State management
- **React Router**: Navigation and routing
- **Reddit JSON API**: Data source
- **CSS Modules**: Styling

## Project Structure

```
src/
├── components/         # Reusable UI components
├── features/          # Feature-specific components and logic
│   ├── posts/        # Post-related features
│   ├── comments/     # Comment-related features
│   ├── search/       # Search functionality
│   ├── subreddits/   # Subreddit-related features
│   └── users/        # User profile features
├── store/            # Redux store configuration
└── App.js           # Main application component
```

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/YFolla/MinimalReddit.git
cd MinimalReddit
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## API Rate Limiting

As of July 01, 2023, Reddit's API is limited to 10 queries per minute for free usage. The application handles rate limiting by:
- Debouncing search requests
- Caching responses where appropriate
- Providing user feedback when rate limits are hit

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 