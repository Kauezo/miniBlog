import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { useUserPosts } from "../hooks/useUserPosts";
import { useAuth } from "../hooks/useAuth";
import PostCard from "../components/PostCard";
import { FaEdit } from "react-icons/fa";
import "./Profile.css";

// Avatar padrão em base64 (imagem simples cinza claro com perfil)
const defaultAvatar =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTYgMjU2Ij48cmVjdCB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgZmlsbD0iI2UwZTBlMCIvPjxjaXJjbGUgY3g9IjEyOCIgY3k9IjEwMCIgcj0iNDAiIGZpbGw9IiNiYmJiYmIiLz48cGF0aCBkPSJNMjEzLjIsMjA4LjFDMTk3LjksMTcwLjUsMTY1LjcsMTQ2LDEyOCwxNDZjLTM3LjcsMC02OS45LDI0LjUtODUuMiw2Mi4xYTQsNCwwLDAsMCwzLjcsNS45SDIwOS41YTQsNCwwLDAsMCwzLjctNS45WiIgZmlsbD0iI2JiYmJiYiIvPjwvc3ZnPg==";

const Profile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [profileError, setProfileError] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const {
    posts,
    loading: postsLoading,
    error: postsError,
    toggleLike,
  } = useUserPosts(id);

  // Verificar se o perfil é do usuário atual
  const isOwnProfile = user?.uid === id;

  // Carregar dados do perfil do usuário
  useEffect(() => {
    const fetchUserProfile = async () => {
      setProfileLoading(true);
      try {
        const userDoc = await getDoc(doc(db, "users", id));

        if (userDoc.exists()) {
          setUserProfile(userDoc.data());
        } else {
          setProfileError("Usuário não encontrado");
        }
        setProfileLoading(false);
      } catch (error) {
        setProfileError("Erro ao carregar o perfil: " + error.message);
        setProfileLoading(false);
      }
    };

    fetchUserProfile();
  }, [id]);

  if (profileLoading || postsLoading) {
    return <div className="loading">Carregando perfil...</div>;
  }

  if (profileError) {
    return <div className="error">{profileError}</div>;
  }

  if (postsError) {
    return <div className="error">{postsError}</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-image">
          <img
            src={userProfile?.photoURL || defaultAvatar}
            alt={userProfile?.displayName}
          />
        </div>
        <div className="profile-info">
          <div className="profile-name-actions">
            <h2>{userProfile?.displayName}</h2>
            {isOwnProfile && (
              <Link to="/edit-profile" className="edit-profile-btn">
                <FaEdit /> Editar Perfil
              </Link>
            )}
          </div>
          <p className="profile-stats">
            <span>
              {posts.length} {posts.length === 1 ? "post" : "posts"}
            </span>
          </p>
          {userProfile?.bio && <p className="profile-bio">{userProfile.bio}</p>}
        </div>
      </div>

      <div className="profile-posts-section">
        <h3>Publicações</h3>

        {posts.length === 0 ? (
          <p className="no-posts">Nenhuma publicação ainda</p>
        ) : (
          <div className="profile-posts">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} toggleLike={toggleLike} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
