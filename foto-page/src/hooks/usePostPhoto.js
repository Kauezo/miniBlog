import { useState } from "react";
import { db } from "../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "./useAuth";

export const usePostPhoto = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const postPhoto = async (imageUrl, caption) => {
    setLoading(true);
    setError(null);

    try {
      // Validar endereço da imagem
      if (!imageUrl || !imageUrl.trim()) {
        throw new Error("Endereço da imagem é obrigatório");
      }

      // Garantir que a URL tenha um protocolo válido
      let finalImageUrl = imageUrl;
      if (!finalImageUrl.startsWith('http://') && !finalImageUrl.startsWith('https://')) {
        finalImageUrl = 'https://' + finalImageUrl;
      }

      // Criar documento da postagem usando o endereço fornecido
      await addDoc(collection(db, "posts"), {
        photoURL: finalImageUrl,
        caption,
        createdAt: serverTimestamp(),
        userId: user.uid,
        userName: user.displayName,
        userPhotoURL: user.photoURL || "",
        likes: [],
        comments: []
      });
      
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return { loading, error, postPhoto };
}; 