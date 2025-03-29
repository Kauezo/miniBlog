import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { 
  collection, 
  query, 
  where,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  orderBy
} from "firebase/firestore";
import { useAuth } from "./useAuth";

export const useUserPosts = (userId) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Buscar posts do usuário
  useEffect(() => {
    const fetchUserPosts = async () => {
      setLoading(true);
      
      try {
        const q = query(
          collection(db, "posts"),
          where("userId", "==", userId),
          orderBy("createdAt", "desc")
        );
        
        const querySnapshot = await getDocs(q);
        const userPosts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setPosts(userPosts);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserPosts();
    }
  }, [userId]);

  // Like/unlike post
  const toggleLike = async (postId) => {
    try {
      const postRef = doc(db, "posts", postId);
      const post = posts.find((post) => post.id === postId);
      
      if (post && post.likes && post.likes.includes(user.uid)) {
        // Unlike
        await updateDoc(postRef, {
          likes: arrayRemove(user.uid)
        });
        
        // Atualizar estado local
        setPosts(posts.map(p => {
          if (p.id === postId) {
            return {
              ...p,
              likes: p.likes.filter(id => id !== user.uid)
            };
          }
          return p;
        }));
      } else {
        // Like
        await updateDoc(postRef, {
          likes: arrayUnion(user.uid)
        });
        
        // Atualizar estado local
        setPosts(posts.map(p => {
          if (p.id === postId) {
            return {
              ...p,
              likes: [...(p.likes || []), user.uid]
            };
          }
          return p;
        }));
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return { posts, loading, error, toggleLike };
}; 