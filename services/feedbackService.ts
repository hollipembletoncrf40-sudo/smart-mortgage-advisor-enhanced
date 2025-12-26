import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export interface FeedbackData {
  rating: number;
  comment: string;
  category: string;
  userId?: string;
  userEmail?: string;
}

export const submitFeedback = async (data: FeedbackData) => {
  try {
    const feedbackRef = collection(db, 'feedback');
    
    // Build the document data, excluding undefined fields
    const docData: Record<string, any> = {
      rating: data.rating,
      comment: data.comment,
      category: data.category,
      createdAt: serverTimestamp(),
      platform: navigator.userAgent,
      url: window.location.href
    };
    
    // Only add userId and userEmail if they exist (user is logged in)
    if (data.userId) {
      docData.userId = data.userId;
    }
    if (data.userEmail) {
      docData.userEmail = data.userEmail;
    }
    
    await addDoc(feedbackRef, docData);
    return { success: true };
  } catch (error) {
    console.error("Error submitting feedback:", error);
    throw error;
  }
};
