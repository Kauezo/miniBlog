import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove
} from "firebase/firestore";
import { useAuth } from "./useAuth";

export const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Get posts
  useEffect(() => {
    setLoading(true);
    
    try {
      const q = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc")
      );
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const postsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setPosts(postsData);
        setLoading(false);
      });
      
      return () => unsubscribe();
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }, []);

  // Like/unlike post
  const toggleLike = async (postId) => {
    try {
      const postRef = doc(db, "posts", postId);
      const post = posts.find((post) => post.id === postId);
      
      if (post.likes.includes(user.uid)) {
        // Unlike
        await updateDoc(postRef, {
          likes: arrayRemove(user.uid)
        });
      } else {
        // Like
        await updateDoc(postRef, {
          likes: arrayUnion(user.uid)
        });
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return { posts, loading, error, toggleLike };
}; 