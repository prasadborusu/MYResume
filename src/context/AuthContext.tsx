import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { sendOtpEmail, generate6DigitOtp } from '../services/email';
import { UserProfile } from '../types/resume';

interface PendingVerification {
  email: string;
  fullName: string;
  password?: string;
  otp: string;
  expiresAt: number;
  attempts: number;
}

interface AuthContextType {
  user: { id: string; email: string } | null;
  profile: UserProfile | null;
  loading: boolean;
  pendingVerification: PendingVerification | null;
  registerUser: (fullName: string, email: string, password: string) => Promise<{ success: boolean; message: string; otpCode?: string }>;
  verifyOtp: (code: string) => Promise<{ success: boolean; message: string }>;
  resendOtp: () => Promise<{ success: boolean; message: string; otpCode?: string }>;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<{ success: boolean; message: string }>;
  resetPasswordRequest: (email: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_USER_KEY = 'my_resume_auth_user';
const LOCAL_PROFILE_KEY = 'my_resume_auth_profile';
const LOCAL_PENDING_KEY = 'my_resume_pending_otp';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingVerification, setPendingVerification] = useState<PendingVerification | null>(null);

  // Initialize auth state
  useEffect(() => {
    async function initAuth() {
      try {
        // Load pending verification state if any
        const savedPending = localStorage.getItem(LOCAL_PENDING_KEY);
        if (savedPending) {
          try {
            const parsed = JSON.parse(savedPending);
            if (parsed.expiresAt > Date.now()) {
              setPendingVerification(parsed);
            } else {
              localStorage.removeItem(LOCAL_PENDING_KEY);
            }
          } catch (e) {
            localStorage.removeItem(LOCAL_PENDING_KEY);
          }
        }

        // Real Supabase session check if active
        if (isSupabaseConfigured && supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUser({ id: session.user.id, email: session.user.email || '' });
            // Fetch profile
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profileData) {
              setProfile(profileData);
            } else {
              setProfile({
                id: session.user.id,
                full_name: session.user.user_metadata?.full_name || 'User',
                email: session.user.email || '',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              });
            }
            setLoading(false);
            return;
          }
        }

        // Local storage session fallback
        const savedUser = localStorage.getItem(LOCAL_USER_KEY);
        const savedProfile = localStorage.getItem(LOCAL_PROFILE_KEY);
        if (savedUser) {
          setUser(JSON.parse(savedUser));
          if (savedProfile) {
            setProfile(JSON.parse(savedProfile));
          }
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
      } finally {
        setLoading(false);
      }
    }

    initAuth();
  }, []);

  // Register User -> Generate 6 digit OTP -> Send via EmailJS
  const registerUser = async (fullName: string, email: string, password: string) => {
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const otp = generate6DigitOtp();
      const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

      const pendingData: PendingVerification = {
        email: normalizedEmail,
        fullName: fullName.trim(),
        password,
        otp,
        expiresAt,
        attempts: 0
      };

      // Dispatch Email
      const emailResult = await sendOtpEmail(normalizedEmail, fullName.trim(), otp);

      if (!emailResult.success) {
        return {
          success: false,
          message: emailResult.message || 'Failed to send verification email. Please check your EmailJS settings.'
        };
      }

      setPendingVerification(pendingData);
      localStorage.setItem(LOCAL_PENDING_KEY, JSON.stringify(pendingData));

      return {
        success: true,
        message: emailResult.message || 'Verification code sent to your email.'
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Failed to initiate registration.'
      };
    }
  };

  // Resend OTP
  const resendOtp = async () => {
    if (!pendingVerification) {
      return { success: false, message: 'No pending registration found.' };
    }

    const newOtp = generate6DigitOtp();
    const updated: PendingVerification = {
      ...pendingVerification,
      otp: newOtp,
      expiresAt: Date.now() + 5 * 60 * 1000,
      attempts: 0
    };

    const emailResult = await sendOtpEmail(updated.email, updated.fullName, newOtp);

    if (!emailResult.success) {
      return {
        success: false,
        message: emailResult.message || 'Failed to send new verification email.'
      };
    }

    setPendingVerification(updated);
    localStorage.setItem(LOCAL_PENDING_KEY, JSON.stringify(updated));

    return {
      success: true,
      message: 'A new 6-digit code has been sent to your email.'
    };
  };

  // Verify OTP
  const verifyOtp = async (code: string) => {
    if (!pendingVerification) {
      return { success: false, message: 'No verification in progress. Please register again.' };
    }

    if (Date.now() > pendingVerification.expiresAt) {
      return { success: false, message: 'Verification code has expired. Please click Resend Code.' };
    }

    if (pendingVerification.attempts >= 5) {
      return { success: false, message: 'Too many failed attempts. Please request a new code.' };
    }

    if (pendingVerification.otp !== code.trim()) {
      const updated = { ...pendingVerification, attempts: pendingVerification.attempts + 1 };
      setPendingVerification(updated);
      localStorage.setItem(LOCAL_PENDING_KEY, JSON.stringify(updated));
      return { success: false, message: `Invalid verification code. (${5 - updated.attempts} attempts remaining)` };
    }

    // OTP is valid! Create the authenticated user
    try {
      let userId = 'user_' + Math.random().toString(36).substring(2, 11);

      if (isSupabaseConfigured && supabase && pendingVerification.password) {
        // Attempt Supabase auth signup
        const { data, error } = await supabase.auth.signUp({
          email: pendingVerification.email,
          password: pendingVerification.password,
          options: {
            data: { full_name: pendingVerification.fullName }
          }
        });

        if (!error && data.user) {
          userId = data.user.id;
        }
      }

      const verifiedUser = {
        id: userId,
        email: pendingVerification.email
      };

      const verifiedProfile: UserProfile = {
        id: userId,
        full_name: pendingVerification.fullName,
        email: pendingVerification.email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setUser(verifiedUser);
      setProfile(verifiedProfile);
      setPendingVerification(null);

      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(verifiedUser));
      localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(verifiedProfile));
      localStorage.removeItem(LOCAL_PENDING_KEY);

      return { success: true, message: 'Email verified successfully! Welcome to My Resume.' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Verification completed with error.' };
    }
  };

  // Login
  const login = async (email: string, password: string) => {
    try {
      const normalizedEmail = email.trim().toLowerCase();

      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password
        });

        if (error) {
          return { success: false, message: error.message };
        }

        if (data.user) {
          const loggedUser = { id: data.user.id, email: data.user.email || normalizedEmail };
          setUser(loggedUser);

          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          const currentProfile = profileData || {
            id: data.user.id,
            full_name: data.user.user_metadata?.full_name || 'User',
            email: normalizedEmail,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };

          setProfile(currentProfile);
          localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(loggedUser));
          localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(currentProfile));
          return { success: true, message: 'Signed in successfully.' };
        }
      }

      // Local storage fallback login
      const savedUserStr = localStorage.getItem(LOCAL_USER_KEY);
      if (savedUserStr) {
        const saved = JSON.parse(savedUserStr);
        if (saved.email.toLowerCase() === normalizedEmail) {
          setUser(saved);
          const savedProfStr = localStorage.getItem(LOCAL_PROFILE_KEY);
          if (savedProfStr) setProfile(JSON.parse(savedProfStr));
          return { success: true, message: 'Signed in successfully.' };
        }
      }

      // If logging in for the first time in mock mode
      const newMockUser = { id: 'usr_' + Math.random().toString(36).substring(2, 9), email: normalizedEmail };
      const newMockProfile: UserProfile = {
        id: newMockUser.id,
        full_name: normalizedEmail.split('@')[0],
        email: normalizedEmail,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setUser(newMockUser);
      setProfile(newMockProfile);
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(newMockUser));
      localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(newMockProfile));

      return { success: true, message: 'Signed in successfully.' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Login failed.' };
    }
  };

  // Logout
  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(null);
    localStorage.removeItem(LOCAL_USER_KEY);
    localStorage.removeItem(LOCAL_PROFILE_KEY);
  };

  // Update Profile
  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!profile || !user) return { success: false, message: 'User not authenticated.' };

    const updated: UserProfile = {
      ...profile,
      ...data,
      updated_at: new Date().toISOString()
    };

    setProfile(updated);
    localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(updated));

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('profiles')
          .upsert(updated);
      } catch (e) {
        console.warn('Failed to sync profile with Supabase:', e);
      }
    }

    return { success: true, message: 'Profile updated successfully.' };
  };

  // Reset Password Request
  const resetPasswordRequest = async (email: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail);
      if (error) return { success: false, message: error.message };
    }
    return {
      success: true,
      message: `Password reset instructions sent to ${normalizedEmail}.`
    };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        pendingVerification,
        registerUser,
        verifyOtp,
        resendOtp,
        login,
        logout,
        updateProfile,
        resetPasswordRequest
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
