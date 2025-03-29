import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePostPhoto } from "../hooks/usePostPhoto";
import "./CreatePost.css";

const CreatePost = () => {
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [preview, setPreview] = useState(null);
  const [imageError, setImageError] = useState(false);
  const { postPhoto, loading, error } = usePostPhoto();
  const navigate = useNavigate();

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setImageUrl(url);
    setImageError(false);

    // Ao mudar o endereço, limpa a visualização
    if (preview) {
      setPreview(null);
    }
  };

  const handlePreviewImage = (e) => {
    e.preventDefault();

    if (!imageUrl.trim()) {
      alert("Por favor, informe o endereço de uma imagem");
      return;
    }

    // Adiciona http:// no início se não tiver um protocolo
    let finalUrl = imageUrl;
    if (!finalUrl.startsWith("http://") && !finalUrl.startsWith("https://")) {
      finalUrl = "https://" + finalUrl;
      setImageUrl(finalUrl);
    }

    setImageError(false);
    setPreview(finalUrl);
  };

  const handleImageError = () => {
    setImageError(true);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageUrl.trim()) {
      alert("Por favor, informe o endereço de uma imagem");
      return;
    }

    if (!preview) {
      alert("Por favor, visualize a imagem antes de compartilhar");
      return;
    }

    await postPhoto(imageUrl, caption);
    navigate("/");
  };

  return (
    <div className="create-post">
      <h2>Compartilhar uma Foto</h2>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit} className="create-post-form">
        <div className="image-url-container">
          <label htmlFor="imageUrl">Endereço da imagem</label>
          <div className="url-input-group">
            <input
              type="text"
              id="imageUrl"
              placeholder="exemplo.com/minha-imagem.jpg"
              value={imageUrl}
              onChange={handleImageUrlChange}
              className="image-url-input"
              required
            />
            <button
              type="button"
              onClick={handlePreviewImage}
              className="preview-btn"
            >
              Visualizar
            </button>
          </div>
          {imageError && (
            <p className="image-error">
              Não foi possível carregar esta imagem. Verifique o endereço e
              tente novamente.
            </p>
          )}
        </div>

        <div className="image-preview-container">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="image-preview"
              onError={handleImageError}
            />
          ) : (
            <div className="preview-placeholder">
              <p>Visualização da imagem aparecerá aqui</p>
              <p className="url-example">Exemplos:</p>
              <p className="url-example">imgur.com/exemplo.jpg</p>
              <p className="url-example">exemplo.com/imagens/foto.png</p>
            </div>
          )}
        </div>

        <textarea
          placeholder="Escreva uma legenda..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="caption-input"
        />

        <button
          type="submit"
          className="submit-btn"
          disabled={loading || !imageUrl.trim() || !preview}
        >
          {loading ? "Publicando..." : "Compartilhar"}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
