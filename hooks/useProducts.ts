import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Product } from '../types';
import { PRODUCTS as MOCK_PRODUCTS } from '../constants';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    // Subscribe to real-time updates
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const firebaseProducts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];

      // If database is empty, fall back to mock data so the site isn't empty
      if (firebaseProducts.length === 0 && !snapshot.metadata.fromCache) {
        setProducts(MOCK_PRODUCTS);
      } else {
        setProducts(firebaseProducts);
      }
      setLoading(false);
    }, (err) => {
      console.error("Error fetching products:", err);
      // Fallback on error
      setProducts(MOCK_PRODUCTS);
      setError("Failed to load live products. Showing offline catalog.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { products, loading, error };
};
