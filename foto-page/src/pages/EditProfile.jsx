import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { db, auth } from "../firebase/config";
import { useAuth } from "../hooks/useAuth";
import "./EditProfile.css";

// Avatar padrão em base64 (imagem simples cinza claro com perfil)
const defaultAvatar =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTYgMjU2Ij48cmVjdCB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgZmlsbD0iI2UwZTBlMCIvPjxjaXJjbGUgY3g9IjEyOCIgY3k9IjEwMCIgcj0iNDAiIGZpbGw9IiNiYmJiYmIiLz48cGF0aCBkPSJNMjEzLjIsMjA4LjFDMTk3LjksMTcwLjUsMTY1LjcsMTQ2LDEyOCwxNDZjLTM3LjcsMC02OS45LDI0LjUtODUuMiw2Mi4xYTQsNCwwLDAsMCwzLjcsNS45SDIwOS41YTQsNCwwLDAsMCwzLjctNS45WiIgZmlsbD0iI2JiYmJiYiIvPjwvc3ZnPg==";

const EditProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);

  // Carregar dados do usuário
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!user) return;

        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setDisplayName(userData.displayName || "");
          setPhotoURL(userData.photoURL || "");
          setPreview(userData.photoURL || defaultAvatar);
          setBio(userData.bio || "");
        }
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
        setError("Erro ao carregar dados do usuário");
      }
    };

    fetchUserData();
  }, [user]);

  const handlePhotoURLChange = (e) => {
    const url = e.target.value;
    setPhotoURL(url);
  };

  const handlePreviewImage = () => {
    if (photoURL.trim()) {
      setPreview(photoURL);
    } else {
      setPreview(defaultAvatar);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!user) throw new Error("Usuário não autenticado");

      // Garantir que a URL tenha um protocolo válido
      let finalPhotoURL = photoURL;
      if (
        photoURL &&
        !photoURL.startsWith("http://") &&
        !photoURL.startsWith("https://") &&
        !photoURL.startsWith("data:")
      ) {
        finalPhotoURL = "https://" + photoURL;
      }

      // Atualizar perfil no Firebase Auth
      await updateProfile(auth.currentUser, {
        displayName,
        photoURL: finalPhotoURL,
      });

      // Atualizar dados no Firestore
      await updateDoc(doc(db, "users", user.uid), {
        displayName,
        photoURL: finalPhotoURL,
        bio,
      });

      // Redirecionar para a página de perfil
      navigate(`/profile/${user.uid}`);
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      setError("Erro ao atualizar perfil: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-profile-container">
      <h2>Editar Perfil</h2>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit} className="edit-profile-form">
        <div className="profile-preview">
          <img
            src={preview || defaultAvatar}
            alt="Preview"
            className="profile-image-preview"
            onError={() => setPreview(defaultAvatar)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="displayName">Nome</label>
          <input
            type="text"
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="photoURL">Endereço da foto de perfil</label>
          <div className="url-input-group">
            <input
              type="text"
              id="photoURL"
              value={photoURL}
              onChange={handlePhotoURLChange}
              placeholder="exemplo.com/minha-foto.jpg"
            />
            <button
              type="button"
              onClick={handlePreviewImage}
              className="preview-btn"
            >
              Visualizar
            </button>
          </div>
          <small className="form-help">
            Deixe em branco para usar o avatar padrão
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="bio">Biografia</label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Conte um pouco sobre você..."
            rows="4"
          />
        </div>

        <div className="form-buttons">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate(`/profile/${user.uid}`)}
          >
            Cancelar
          </button>
          <button type="submit" className="save-btn" disabled={loading}>
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
