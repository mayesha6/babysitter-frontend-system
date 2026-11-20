'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import api from '../services/api';
import { useToast } from './ToastContext';

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'PARENT' | 'BABYSITTER';
  status?: string;
  profileCompleted?: boolean;
  isEmailVerified?: boolean;
}

export interface NotificationItem {
  _id: string;
  title?: string;
  message: string;
  isRead: boolean;
  createdAt?: string;
}

interface AppContextType {
  user: User | null;
  profile: any;
  loading: boolean;
  socket: Socket | null;
  notifications: NotificationItem[];
  unreadCount: number;
  login: (email: string, password: string) => Promise<User>;
  register: (payload: any) => Promise<any>;
  verifyOtp: (email: string, otp: string | number) => Promise<void>;
  logout: () => void;
  fetchSubProfile: (userData?: User | null) => Promise<void>;
  fetchNotifications: () => Promise<void>;
  markNotificationsRead: () => Promise<void>;
  switchRole: (targetRole: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  // Load current user profile from token on mount
  useEffect(() => {
    const fetchUser = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        setLoading(false);
        return;
      }

      // Check for demo token session
      if (token.startsWith('demo-token-')) {
        const savedDemo = localStorage.getItem('demo_user');
        if (savedDemo) {
          try {
            const parsed = JSON.parse(savedDemo);
            setUser(parsed);
            await fetchSubProfile(parsed);
          } catch (e) {
            console.error('Failed to parse demo user session:', e);
          }
        }
        setLoading(false);
        return;
      }

      try {
        const response: any = await api.get('/user/me');
        const userData = response.data || response;
        setUser(userData);
        
        // Fetch sub-profile (sitter or parent)
        if (userData.profileCompleted) {
          await fetchSubProfile(userData);
        }
        
        // Fetch notifications
        fetchNotifications();
      } catch (err: any) {
        console.error('Failed to restore session:', err.message);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Fetch sub-profile based on role
  const fetchSubProfile = async (userData?: User | null) => {
    const activeUser = userData || user;
    if (!activeUser) return;
    try {
      if (activeUser.role === 'PARENT') {
        const res: any = await api.get(`/parent-profile/${activeUser._id}`);
        setProfile(res.data || res);
      } else if (activeUser.role === 'BABYSITTER') {
        const res: any = await api.get(`/sitter-profile/${activeUser._id}`);
        setProfile(res.data || res);
      }
    } catch (err: any) {
      console.error('Error fetching sub-profile:', err.message);
    }
  };

  // Socket connection manager
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token || !user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';
    const socketClient = io(socketUrl, {
      auth: { token },
      transports: ['websocket'],
    });

    socketClient.on('connect', () => {
      console.log('⚡ Real-time Socket connected to backend');
    });

    // Real-time toast notifications handler
    socketClient.on('notification', (data: any) => {
      const title = data.title || 'New Notification';
      const message = data.message || 'You received a new update.';
      toast.info(message, title);
      setUnreadCount((prev) => prev + 1);
      fetchNotifications();
    });

    socketClient.on('new_message', (data: any) => {
      const senderName = data.senderName || 'Someone';
      toast.info(`Message: ${data.content || data.message || 'New message received'}`, `New Message from ${senderName}`);
    });

    socketClient.on('booking_updated', (data: any) => {
      toast.success(data.message || 'Booking status has been updated!', 'Booking Update');
    });

    socketClient.on('connect_error', (err) => {
      console.error('🔌 Socket connection error:', err.message);
    });

    setSocket(socketClient);

    return () => {
      socketClient.disconnect();
    };
  }, [user]);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const res: any = await api.get('/notifications');
      setNotifications(res.data || []);
      const countRes: any = await api.get('/notifications/unread-count');
      setUnreadCount(countRes.data || 0);
    } catch (err: any) {
      console.error('Failed to load notifications:', err.message);
    }
  };

  // Mark all notifications read
  const markNotificationsRead = async () => {
    try {
      await api.patch('/notifications/mark-all-read');
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err: any) {
      console.error('Error marking notifications read:', err.message);
    }
  };

  // Handle Log In
  const login = async (email: string, password: string): Promise<User> => {
    try {
      const response: any = await api.post('/auth/login', { email, password });
      const token =
        response.token ||
        response.accessToken ||
        response.data?.token ||
        response.data?.accessToken;

      if (!token) {
        throw new Error('No token returned from login server');
      }

      localStorage.setItem('token', token);

      const meResponse: any = await api.get('/user/me');
      const userData = meResponse.data || meResponse;
      setUser(userData);
      
      await fetchSubProfile(userData);
      fetchNotifications();
      
      if (userData.role === 'SUPER_ADMIN' || userData.role === 'ADMIN') {
        router.push('/admin-dashboard');
      } else if (userData.role === 'PARENT') {
        router.push('/parent-dashboard');
      } else if (userData.role === 'BABYSITTER') {
        router.push('/sitter-dashboard');
      } else {
        router.push('/');
      }
      return userData;
    } catch (err) {
      throw err;
    }
  };

  // Handle Registration
  const register = async (payload: any): Promise<any> => {
    try {
      const res: any = await api.post('/user/register', payload);
      return res.data || res;
    } catch (err) {
      throw err;
    }
  };

  // Handle OTP Verification
  const verifyOtp = async (email: string, otp: string | number): Promise<void> => {
    try {
      await api.post('/otp/verify-signup-otp', { email, otp: Number(otp) });
    } catch (err) {
      throw err;
    }
  };

  // Handle Log Out
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('demo_user');
    setUser(null);
    setProfile(null);
    setNotifications([]);
    setUnreadCount(0);
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
    router.push('/auth');
  };

  // Quick Role Login / Switcher
  const switchRole = async (targetRole: string) => {
    let email = '';
    let password = 'Password@123';
    let demoName = '';
    let targetPath = '/';
    const normalizedRole = (targetRole === 'ADMIN' || targetRole === 'SUPER_ADMIN') ? 'SUPER_ADMIN' : targetRole;

    if (normalizedRole === 'SUPER_ADMIN') {
      email = 'super@gmail.com';
      password = '12345678';
      demoName = 'Super Admin';
      targetPath = '/admin-dashboard';
    } else if (normalizedRole === 'PARENT') {
      email = 'parent@gmail.com';
      password = 'Password@123';
      demoName = 'Rahat Hossain';
      targetPath = '/parent-dashboard';
    } else if (normalizedRole === 'BABYSITTER') {
      email = 'sitter@gmail.com';
      password = 'Password@123';
      demoName = 'Jannat ul Ferdous';
      targetPath = '/sitter-dashboard';
    }

    try {
      // 1. Attempt standard backend authentication
      await login(email, password);
    } catch (err: any) {
      console.warn(`Direct API login failed for ${targetRole}, enabling Demo Mode:`, err.message);

      // 2. Fallback to instant Demo Mode so all dashboard features can be tested
      const demoUser: User = {
        _id: normalizedRole === 'SUPER_ADMIN' ? 'demo-admin-id' : normalizedRole === 'PARENT' ? 'demo-parent-id' : 'demo-sitter-id',
        name: demoName,
        email,
        phone: '01712345678',
        role: normalizedRole as any,
        status: 'ACTIVE',
        profileCompleted: true,
        isEmailVerified: true
      };

      localStorage.setItem('token', `demo-token-${normalizedRole.toLowerCase()}`);
      localStorage.setItem('demo_user', JSON.stringify(demoUser));
      setUser(demoUser);

      if (normalizedRole === 'PARENT') {
        setProfile({
          user: demoUser._id,
          address: 'Dhanmondi, Dhaka',
          childrenCount: 1,
          childrenAges: '3',
          specialNeeds: 'None'
        });
      } else if (normalizedRole === 'BABYSITTER') {
        setProfile({
          user: demoUser._id,
          gender: 'FEMALE',
          about: 'Experienced babysitter loving kids with 3+ years experience.',
          experienceYears: 3,
          skills: ['First Aid', 'Cooking', 'CPR'],
          hourlyRate: 350,
          employmentType: 'FULL_TIME',
          verificationStatus: 'VERIFIED'
        });
      }

      toast.success(`Logged in as ${demoName} (${normalizedRole})`, 'Demo Mode Active');
      router.push(targetPath);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        profile,
        loading,
        socket,
        notifications,
        unreadCount,
        login,
        register,
        verifyOtp,
        logout,
        fetchSubProfile,
        fetchNotifications,
        markNotificationsRead,
        switchRole,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
