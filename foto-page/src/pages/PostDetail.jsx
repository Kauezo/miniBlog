import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../hooks/useAuth";
import {
  FaHeart,
  FaRegHeart,
  FaTrashAlt,
  FaEdit,
  FaArrowLeft,
} from "react-icons/fa";
import "./PostDetail.css";

// Avatar padrão em base64
const defaultAvatar =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTYgMjU2Ij48cmVjdCB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgZmlsbD0iI2UwZTBlMCIvPjxjaXJjbGUgY3g9IjEyOCIgY3k9IjEwMCIgcj0iNDAiIGZpbGw9IiNiYmJiYmIiLz48cGF0aCBkPSJNMjEzLjIsMjA4LjFDMTk3LjksMTcwLjUsMTY1LjcsMTQ2LDEyOCwxNDZjLTM3LjcsMC02OS45LDI0LjUtODUuMiw2Mi4xYTQsNCwwLDAsMCwzLjcsNS45SDIwOS41YTQsNCwwLDAsMCwzLjctNS45WiIgZmlsbD0iI2JiYmJiYiIvPjwvc3ZnPg==";

const PostDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCaption, setEditedCaption] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const postDoc = await getDoc(doc(db, "posts", id));

        if (postDoc.exists()) {
          setPost({ id: postDoc.id, ...postDoc.data() });
          setEditedCaption(postDoc.data().caption || "");
        } else {
          setError("Publicação não encontrada");
        }
      } catch (error) {
        console.error("Erro ao carregar publicação:", error);
        setError("Erro ao carregar publicação: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const isLiked = post?.likes?.includes(user?.uid);
  const isOwner = post?.userId === user?.uid;

  const handleToggleLike = async () => {
    try {
      const postRef = doc(db, "posts", id);

      if (isLiked) {
        // Descurtir
        await updateDoc(postRef, {
          likes: arrayRemove(user.uid),
        });
        setPost({
          ...post,
          likes: post.likes.filter((uid) => uid !== user.uid),
        });
      } else {
        // Curtir
        await updateDoc(postRef, {
          likes: arrayUnion(user.uid),
        });
        setPost({
          ...post,
          likes: [...(post.likes || []), user.uid],
        });
      }
    } catch (error) {
      console.error("Erro ao curtir/descurtir:", error);
    }
  };

  const handleSaveEdit = async () => {
    try {
      const postRef = doc(db, "posts", id);
      await updateDoc(postRef, {
        caption: editedCaption,
      });

      setPost({
        ...post,
        caption: editedCaption,
      });

      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao salvar edição:", error);
      setError("Erro ao salvar edição: " + error.message);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "posts", id));
      navigate("/");
    } catch (error) {
      console.error("Erro ao excluir publicação:", error);
      setError("Erro ao excluir publicação: " + error.message);
      setDeleteConfirm(false);
    }
  };

  if (loading) {
    return <div className="loading">Carregando publicação...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!post) {
    return <div className="not-found">Publicação não encontrada</div>;
  }

  return (
    <div className="post-detail-container">
      <div className="post-detail-header">
        <Link to="/" className="back-button">
          <FaArrowLeft /> Voltar
        </Link>

        {isOwner && (
          <div className="post-actions">
            <button
              className="edit-button"
              onClick={() => setIsEditing((prev) => !prev)}
            >
              <FaEdit /> {isEditing ? "Cancelar" : "Editar"}
            </button>

            {!isEditing && (
              <button
                className="delete-button"
                onClick={() => setDeleteConfirm(true)}
              >
                <FaTrashAlt /> Excluir
              </button>
            )}
          </div>
        )}
      </div>

      <div className="post-detail-card">
        <div className="post-detail-user">
          <Link to={`/profile/${post.userId}`} className="user-link">
            <img
              src={post.userPhotoURL || defaultAvatar}
              alt={post.userName}
              className="user-avatar"
            />
            <span className="user-name">{post.userName}</span>
          </Link>
        </div>

        <div className="post-detail-image">
          <img src={post.photoURL} alt={post.caption} className="post-img" />
        </div>

        <div className="post-detail-info">
          <div className="post-detail-actions">
            <button
              className={`like-button ${isLiked ? "liked" : ""}`}
              onClick={handleToggleLike}
            >
              {isLiked ? <FaHeart /> : <FaRegHeart />}
            </button>
            <span className="like-count">
              {post.likes?.length || 0} curtidas
            </span>
          </div>

          {isEditing ? (
            <div className="edit-caption-container">
              <textarea
                value={editedCaption}
                onChange={(e) => setEditedCaption(e.target.value)}
                className="caption-textarea"
                placeholder="Escreva uma legenda..."
              />
              <button className="save-edit-button" onClick={handleSaveEdit}>
                Salvar
              </button>
            </div>
          ) : (
            <p className="post-caption">
              <Link to={`/profile/${post.userId}`} className="caption-username">
                {post.userName}
              </Link>{" "}
              {post.caption}
            </p>
          )}

          {post.createdAt && (
            <p className="post-time">
              {new Date(post.createdAt.toDate()).toLocaleString()}
            </p>
          )}
        </div>
      </div>

      {deleteConfirm && (
        <div className="delete-confirm-modal">
          <div className="delete-confirm-content">
            <h3>Excluir publicação?</h3>
            <p>Esta ação não pode ser desfeita.</p>
            <div className="delete-buttons">
              <button
                className="cancel-delete"
                onClick={() => setDeleteConfirm(false)}
              >
                Cancelar
              </button>
              <button className="confirm-delete" onClick={handleDelete}>
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetail;
