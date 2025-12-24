import { 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '../config/firebase';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  provider: 'google' | 'email';
  createdAt: Date;
  lastLogin: Date;
}

/**
 * Sign in with Google
 */
export const loginWithGoogle = async (): Promise<User> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    await saveUserProfile(result.user, 'google');
    return result.user;
  } catch (error: any) {
    console.error('Google login error:', error);
    throw new Error(getErrorMessage(error.code));
  }
};


/**
 * Sign in with email and password
 */
export const loginWithEmail = async (email: string, password: string): Promise<User> => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    await updateLastLogin(result.user.uid);
    return result.user;
  } catch (error: any) {
    console.error('Email login error:', error);
    throw new Error(getErrorMessage(error.code));
  }
};

/**
 * Sign up with email and password
 */
export const signupWithEmail = async (
  email: string, 
  password: string, 
  displayName: string
): Promise<User> => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update user profile with display name
    await updateProfile(result.user, { displayName });
    
    // Save to Firestore
    await saveUserProfile(result.user, 'email', displayName);
    
    return result.user;
  } catch (error: any) {
    console.error('Email signup error:', error);
    throw new Error(getErrorMessage(error.code));
  }
};

/**
 * Sign out current user
 */
export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error('Logout error:', error);
    throw new Error('登出失败，请重试');
  }
};

/**
 * Send password reset email
 */
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    console.error('Password reset error:', error);
    throw new Error(getErrorMessage(error.code));
  }
};

/**
 * Save or update user profile in Firestore
 */
const saveUserProfile = async (
  user: User, 
  provider: 'google' | 'email',
  displayName?: string
): Promise<void> => {
  try {
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    
    const now = new Date();
    
    if (!userDoc.exists()) {
      // Create new user profile
      const profile: UserProfile = {
        uid: user.uid,
        email: user.email,
        displayName: displayName || user.displayName,
        photoURL: user.photoURL,
        provider,
        createdAt: now,
        lastLogin: now
      };
      await setDoc(userRef, profile);
    } else {
      // Update last login
      await updateLastLogin(user.uid);
    }
  } catch (error) {
    console.error('Error saving user profile:', error);
    // Don't throw error here to avoid blocking login
  }
};

/**
 * Update user's last login timestamp
 */
const updateLastLogin = async (uid: string): Promise<void> => {
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, { lastLogin: new Date() }, { merge: true });
  } catch (error) {
    console.error('Error updating last login:', error);
  }
};

/**
 * Subscribe to auth state changes
 */
export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Get current user
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

/**
 * Convert Firebase error codes to user-friendly messages
 */
const getErrorMessage = (errorCode: string): string => {
  const errorMessages: Record<string, string> = {
    'auth/email-already-in-use': '该邮箱已被注册',
    'auth/invalid-email': '邮箱格式不正确',
    'auth/operation-not-allowed': '该登录方式未启用',
    'auth/weak-password': '密码强度太弱，至少需要6个字符',
    'auth/user-disabled': '该账号已被禁用',
    'auth/user-not-found': '用户不存在',
    'auth/wrong-password': '密码错误',
    'auth/invalid-credential': '登录凭证无效',
    'auth/account-exists-with-different-credential': '该邮箱已使用其他方式注册',
    'auth/popup-closed-by-user': '登录窗口已关闭',
    'auth/cancelled-popup-request': '登录已取消',
    'auth/popup-blocked': '登录窗口被浏览器拦截，请允许弹窗',
    'auth/network-request-failed': '网络连接失败，请检查网络',
    'auth/too-many-requests': '请求过于频繁，请稍后再试'
  };
  
  return errorMessages[errorCode] || '登录失败，请重试';
};
