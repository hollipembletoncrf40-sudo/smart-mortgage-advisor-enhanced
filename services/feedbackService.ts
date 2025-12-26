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
    await addDoc(feedbackRef, {
      ...data,
      createdAt: serverTimestamp(),
      platform: navigator.userAgent,
      url: window.location.href
    });
    return { success: true };
  } catch (error) {
    console.error("Error submitting feedback:", error);
    throw error;
  }
};
