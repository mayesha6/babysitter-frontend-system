'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { io } from 'socket.io-client';
import api from '../services/api';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [conversations, setConversations] = useState([]);
  const router = useRouter();
  const pathname = usePathname();

  // Load current user profile from token on mount
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await api.get('/user/me');
        const userData = response.data;
        setUser(userData);
        
        // Fetch sub-profile (sitter or parent)
        if (userData.profileCompleted) {
          await fetchSubProfile(userData);
        }
        
        // Fetch notifications
        fetchNotifications();
      } catch (err) {
        console.error('Failed to restore session:', err.message);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Fetch sub-profile based on role
  const fetchSubProfile = async (userData) => {
    const activeUser = userData || user;
    if (!activeUser) return;
    try {
      if (activeUser.role === 'PARENT') {
        const res = await api.get(`/parent-profile/${activeUser._id}`);
        setProfile(res.data);
      } else if (activeUser.role === 'BABYSITTER') {
        const res = await api.get(`/sitter-profile/${activeUser._id}`);
        setProfile(res.data);
      }
    } catch (err) {
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

    // Initialize socket client with token authorization
    const socketClient = io('http://localhost:5000', {
      auth: { token },
      transports: ['websocket'],
    });

    socketClient.on('connect', () => {
      console.log('⚡ Socket connected to backend');
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
      const res = await api.get('/notifications');
      setNotifications(res.data || []);
      const countRes = await api.get('/notifications/unread-count');
      setUnreadCount(countRes.data || 0);
    } catch (err) {
      console.error('Failed to load notifications:', err.message);
    }
  };

  // Mark all notifications read
  const markNotificationsRead = async () => {
    try {
      await api.patch('/notifications/mark-all-read');
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Error marking notifications read:', err.message);
    }
  };

  // Handle Log In
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token } = response;
      localStorage.setItem('token', token);
      
      const meResponse = await api.get('/user/me');
      const userData = meResponse.data;
      setUser(userData);
      
      // Fetch subprofile and notifications
      await fetchSubProfile(userData);
      fetchNotifications();
      
      // Redirect based on role
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
  const register = async (payload) => {
    try {
      const res = await api.post('/user/register', payload);
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  // Handle OTP Verification
  const verifyOtp = async (email, otp) => {
    try {
      await api.post('/otp/verify-signup-otp', { email, otp: Number(otp) });
    } catch (err) {
      throw err;
    }
  };

  // Handle Log Out
  const logout = () => {
    localStorage.removeItem('token');
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

  // Debug Helper: switch roles quickly using specific emails
  const switchRole = async (targetRole) => {
    let email = '';
    let password = 'Password@123';

    if (targetRole === 'SUPER_ADMIN') {
      email = 'super@gmail.com';
      password = '12345678';
    } else if (targetRole === 'PARENT') {
      email = 'parent@gmail.com';
    } else if (targetRole === 'BABYSITTER') {
      email = 'sitter@gmail.com';
    }

    try {
      await login(email, password);
    } catch (err) {
      console.warn(`Could not switch role to ${targetRole}: login failed.`, err.message);
      alert(`Role Switch Failed. Please verify if user exists with email: ${email}`);
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

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
