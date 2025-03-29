import { usePosts } from "../hooks/usePosts";
import PostCard from "../components/PostCard";
import "./Home.css";

const Home = () => {
  const { posts, loading, error, toggleLike } = usePosts();

  return (
    <div className="home-container">
      {loading && <div className="loading">Loading posts...</div>}

      {error && <div className="error">{error}</div>}

      {!loading && posts.length === 0 && (
        <div className="no-posts">
          <h2>No posts yet</h2>
          <p>Be the first to share a photo!</p>
        </div>
      )}

      <div className="posts-container">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} toggleLike={toggleLike} />
        ))}
      </div>
    </div>
  );
};

export default Home;
