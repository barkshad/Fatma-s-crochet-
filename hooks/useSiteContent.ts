import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { SiteContent } from '../types';
import { WHATSAPP_NUMBER } from '../constants';

const DEFAULT_CONTENT: SiteContent = {
  heroTitle: "Handmade With Love, \nOne Stitch at a Time",
  heroSubtitle: "Discover our collection of cozy sweaters, custom bags, and baby gifts. Each piece is crafted by hand for a unique touch.",
  // Placeholder cozy video
  heroBackgroundVideo: "https://cdn.coverr.co/videos/coverr-hands-knitting-a-red-scarf-5394/1080p.mp4", 
  heroImage1: "https://picsum.photos/id/1025/400/500",
  heroImage2: "https://picsum.photos/id/445/400/500",
  aboutTitle: "Hi, I'm Fatma!",
  aboutText1: "Welcome to my cozy corner of the internet. I started crocheting five years ago when I wanted to make a blanket for my nephew. What began as a small hobby quickly turned into a deep passion for fiber arts.",
  aboutText2: "There is something incredibly grounding about taking a simple string of yarn and turning it into something functional, warm, and beautiful.",
  aboutImage: "https://picsum.photos/id/453/800/800",
  contactEmail: "hello@fatmascrochet.com",
  contactPhone: "+254 759 094016",
  whatsappNumber: WHATSAPP_NUMBER,
  instagramUrl: "https://www.instagram.com/xx.fxtma_xx?igsh=MWk1d2dmODhkN2RkcQ=="
};

export const useSiteContent = () => {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We store all general site content in a single document: site_content/main
    const docRef = doc(db, 'site_content', 'main');

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as SiteContent;
        // Merge with defaults to ensure new fields (like video) have values if missing in DB
        setContent({ ...DEFAULT_CONTENT, ...data });
      } else {
        // If it doesn't exist yet, create it with defaults
        setDoc(docRef, DEFAULT_CONTENT);
        setContent(DEFAULT_CONTENT);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { content, loading };
};