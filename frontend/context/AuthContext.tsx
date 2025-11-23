"use client"
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'sonner';
import apiClient from '@/lib/axios';

interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  languagePreference?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface UpdateProfileData {
  name?: string;
  phoneNumber?: string;
  languagePreference?: string;
  currentPassword?: string;
  newPassword?: string;
}

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phoneNumber?: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: UpdateProfileData) => Promise<any>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Check if user is logged in on initial load
useEffect(() => {
    const pathname = window.location.pathname; // or usePathname()

    if (pathname === "/landing") {
        setLoading(false);
        return;
    }

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem("token");

            if (token) {
                apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;

                const response = await apiClient.get("/api/auth/me");
                setUser(response.data);
                localStorage.setItem("user", JSON.stringify(response.data));
            }
        } catch (error) {
            console.error("Auth check failed:", error);
            localStorage.removeItem("token");
            delete apiClient.defaults.headers.common["Authorization"];
        } finally {
            setLoading(false);
        }
    };

    checkAuth();
}, []);


  // Login user
  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.post('/api/auth/login', { email, password });
      const { token, ...userData } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
  // Persist user data
  localStorage.setItem('user', JSON.stringify(userData));
      
      // Update user state
      setUser(userData);
      
      // Redirect to dashboard or intended page
      const redirectTo = localStorage.getItem('redirectAfterLogin') || '/dashboard';
      localStorage.removeItem('redirectAfterLogin');
      router.push(redirectTo);
      
      toast.success('Login successful!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(errorMessage);
      throw error;
    }
  };

  // Register new user
  const register = async (name: string, email: string, password: string, phoneNumber?: string) => {
    try {
      const response = await apiClient.post('/api/auth/register', { name, email, password, phoneNumber });
      const { token, ...userData } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
  // Persist user data
  localStorage.setItem('user', JSON.stringify(userData));
      
      // Update user state
      setUser(userData);
      
      // Redirect to dashboard
      router.push('/dashboard');
      
      toast.success('Registration successful!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
      throw error;
    }
  };

  // Logout user
  const logout = () => {
    // Clear token from localStorage
    localStorage.removeItem('token');
    
    // Clear axios auth header
    delete apiClient.defaults.headers.common['Authorization'];
    
    // Clear user state
    setUser(null);
    
    // Redirect to login page
    router.push('/auth/login');
    
    toast.success('Logged out successfully');
  };

  // Update profile
  const updateProfile = async (data: UpdateProfileData) => {
    try {
      const response = await apiClient.put('/api/auth/me', data);
      const updatedUser = response.data.user;

      setUser(prev => ({
        ...prev!,
        ...updatedUser
      }));

      // Update user in localStorage (replace or set)
      localStorage.setItem('user', JSON.stringify({
        ...((JSON.parse(localStorage.getItem('user') || 'null') || {})),
        ...updatedUser
      }));

      // return full response so callers can show server message
      return response.data;
    } catch (error) {
      console.error('Update profile failed:', error);
      throw error;
    }
  };

  // Check if user is authenticated
  const isAuthenticated = !!user;

  // Protect routes
  useEffect(() => {
    if (loading) return;
    
    const publicPaths = ['/auth/login', '/auth/register', '/auth/forgot-password'];
    const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
    
    if (!isAuthenticated && !isPublicPath) {
      // Store the current path to redirect back after login
      localStorage.setItem('redirectAfterLogin', pathname);
      router.push('/auth/login');
    } else if (isAuthenticated && isPublicPath) {
      // If user is logged in and tries to access auth pages, redirect to dashboard
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, pathname, router]);

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
