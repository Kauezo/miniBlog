import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart, FaComment, FaEllipsisH } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "../hooks/useAuth";
import "./PostCard.css";

// Avatar padrão em base64 (imagem simples cinza claro com perfil)
const defaultAvatar =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTYgMjU2Ij48cmVjdCB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgZmlsbD0iI2UwZTBlMCIvPjxjaXJjbGUgY3g9IjEyOCIgY3k9IjEwMCIgcj0iNDAiIGZpbGw9IiNiYmJiYmIiLz48cGF0aCBkPSJNMjEzLjIsMjA4LjFDMTk3LjksMTcwLjUsMTY1LjcsMTQ2LDEyOCwxNDZjLTM3LjcsMC02OS45LDI0LjUtODUuMiw2Mi4xYTQsNCwwLDAsMCwzLjcsNS45SDIwOS41YTQsNCwwLDAsMCwzLjctNS45WiIgZmlsbD0iI2JiYmJiYiIvPjwvc3ZnPg==";

const PostCard = ({ post, toggleLike }) => {
  const { user } = useAuth();
  const isLiked = post.likes && post.likes.includes(user?.uid);
  const isOwner = post.userId === user?.uid;

  // Format timestamp
  const timestamp = post.createdAt?.toDate
    ? formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true })
    : "just now";

  return (
    <div className="post-card">
      <div className="post-header">
        <Link to={`/profile/${post.userId}`} className="post-user">
          <img
            src={post.userPhotoURL || defaultAvatar}
            alt={post.userName}
            className="post-user-img"
          />
          <span className="post-username">{post.userName}</span>
        </Link>
        <div className="post-header-actions">
          <span className="post-time">{timestamp}</span>
          {isOwner && (
            <Link to={`/post/${post.id}`} className="post-options">
              <FaEllipsisH />
            </Link>
          )}
        </div>
      </div>

      <Link to={`/post/${post.id}`} className="post-img-container">
        <img src={post.photoURL} alt={post.caption} className="post-img" />
      </Link>

      <div className="post-actions">
        <button
          className={`post-like-btn ${isLiked ? "liked" : ""}`}
          onClick={() => toggleLike(post.id)}
        >
          {isLiked ? <FaHeart /> : <FaRegHeart />}
        </button>
        <Link to={`/post/${post.id}`} className="post-comment-btn">
          <FaComment />
        </Link>
      </div>

      <div className="post-info">
        <span className="post-likes">{post.likes?.length || 0} curtidas</span>
        {post.caption && (
          <p className="post-caption">
            <Link
              to={`/profile/${post.userId}`}
              className="post-caption-username"
            >
              {post.userName}
            </Link>{" "}
            {post.caption}
          </p>
        )}
        {post.comments?.length > 0 && (
          <Link to={`/post/${post.id}`} className="post-view-comments">
            Ver todos os {post.comments.length} comentários
          </Link>
        )}
      </div>
    </div>
  );
};

export default PostCard;
