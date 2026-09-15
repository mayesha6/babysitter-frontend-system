'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useApp } from '../../context/AppContext';
import api from '../../services/api';
import { ShieldAlert } from 'lucide-react';

import AdminSidebarNav from '../../components/admin/AdminSidebarNav';
import AdminOverviewTab from '../../components/admin/AdminOverviewTab';
import AdminVerificationTab from '../../components/admin/AdminVerificationTab';
import AdminUsersTab from '../../components/admin/AdminUsersTab';
import AdminTransactionsTab from '../../components/admin/AdminTransactionsTab';

export default function AdminDashboard() {
  const { user } = useApp();
  const router = useRouter();

  // Tab control: 'overview', 'verification', 'users', 'transactions'
  const [activeTab, setActiveTab] = useState('overview');

  // Review modal / sitter state
  const [reviewSitter, setReviewSitter] = useState(null);

  // Data states
  const [stats, setStats] = useState({ totalUsers: 0, parents: 0, sitters: 0, verifiedSitters: 0 });
  const [pendingSitters, setPendingSitters] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // Control state
  const [loadingData, setLoadingData] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Security check: redirect if not admin/super-admin
  useEffect(() => {
    if (user && user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN') {
      router.push('/');
    }
  }, [user]);

  const loadAdminData = async () => {
    if (!user) return;
    setLoadingData(true);
    setErrorMsg(null);
    try {
      // 1. Load all users
      const usersRes = await api.get('/user/all-users');
      const allUsers = usersRes.data || [];
      setUsersList(allUsers);

      // 2. Load babysitters list
      const sittersRes = await api.get('/sitter-profile');
      const allSitters = sittersRes.data || [];
      const pendingList = allSitters.filter(s => s.verificationStatus === 'PENDING' && s.nidNumber);
      setPendingSitters(pendingList);

      // Calculate statistics
      const totalUsers = allUsers.length;
      const parents = allUsers.filter(u => u.role === 'PARENT').length;
      const sitters = allUsers.filter(u => u.role === 'BABYSITTER').length;
      const verifiedSitters = allSitters.filter(s => s.verificationStatus === 'VERIFIED').length;
      setStats({ totalUsers, parents, sitters, verifiedSitters });

      // 3. Load transactions
      try {
        const txRes = await api.get('/payments/history');
        setTransactions(txRes.data || []);
      } catch (txErr) {
        console.warn('Failed to load transaction history from API.', txErr.message);
      }
    } catch (err) {
      console.warn('Admin tables unavailable, loading mock admin state.', err.message);
      // Fallback mock data
      setStats({ totalUsers: 8, parents: 4, sitters: 3, verifiedSitters: 1 });
      setPendingSitters([
        {
          _id: 'sitter1',
          user: { _id: 'sitter1', name: 'Jannat ul Ferdous', email: 'jannat@gmail.com', phone: '01711223344' },
          address: 'Dhanmondi, Dhaka',
          nidNumber: '1998261726354',
          nidFrontImage: 'https://images.unsplash.com/photo-1554080353-a576cf803bda?auto=format&fit=crop&w=300&q=80',
          nidBackImage: 'https://images.unsplash.com/photo-1554080353-a576cf803bda?auto=format&fit=crop&w=300&q=80',
          selfieImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
          policeClearanceImage: 'https://images.unsplash.com/photo-1554080353-a576cf803bda?auto=format&fit=crop&w=300&q=80',
          verificationStatus: 'PENDING'
        }
      ]);
      setUsersList([
        { _id: 'admin1', name: 'Super Admin', email: 'super@gmail.com', role: 'SUPER_ADMIN', status: 'ACTIVE' },
        { _id: 'p1', name: 'Rahat Hossain', email: 'parent@gmail.com', role: 'PARENT', status: 'ACTIVE' },
        { _id: 's1', name: 'Jannat ul Ferdous', email: 'sitter@gmail.com', role: 'BABYSITTER', status: 'ACTIVE' }
      ]);
      setTransactions([
        { _id: 't1', parent: { name: 'Rahat Hossain' }, sitter: { name: 'Jannat ul Ferdous' }, amount: 2400, createdAt: new Date() }
      ]);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [user, activeTab]);

  const handleVerifySitter = async (sitterUserId, status) => {
    try {
      await api.patch(`/sitter-profile/${sitterUserId}/verify`, { status });
      setSuccessMsg(`Sitter verification status updated to ${status}!`);
      setReviewSitter(null);
      loadAdminData();
    } catch (err) {
      setErrorMsg(err.message || 'Verification submission failed.');
    }
  };

  const handleToggleBlockUser = async (userId, currentStatus) => {
    try {
      const nextStatus = currentStatus === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
      await api.patch(`/user/${userId}`, { status: nextStatus });
      setSuccessMsg(`User status updated to ${nextStatus}!`);
      loadAdminData();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to toggle user status.');
    }
  };

  if (!user) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <div className="container flex-center" style={{ flex: 1, flexDirection: 'column', gap: '16px' }}>
          <ShieldAlert size={48} color="var(--color-danger)" />
          <h3 style={{ fontWeight: '600' }}>Admin Auth Required</h3>
          <p>Please log in as an Admin to view this page.</p>
          <button onClick={() => router.push('/auth')} className="btn btn-primary">Log In</button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />

      <main style={{ flex: 1, background: 'var(--color-bg-light)' }}>
        <div className="container">
          <div className="dashboard-layout">
            
            {/* Sidebar navigation */}
            <AdminSidebarNav 
              user={user} 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              pendingCount={pendingSitters.length} 
            />

            {/* Main Content Area */}
            <div>
              {/* Alert Feedback Messages */}
              {errorMsg && (
                <div style={{ background: 'rgba(255, 110, 110, 0.1)', border: '1px solid var(--color-danger)', color: 'var(--color-danger)', padding: '12px', borderRadius: '8px', fontSize: '13px', marginBottom: '20px' }}>
                  {errorMsg}
                </div>
              )}
              {successMsg && (
                <div style={{ background: 'rgba(76, 217, 100, 0.1)', border: '1px solid var(--color-success)', color: 'var(--color-success)', padding: '12px', borderRadius: '8px', fontSize: '13px', marginBottom: '20px' }}>
                  {successMsg}
                </div>
              )}

              {/* OVERVIEW TAB */}
              {activeTab === 'overview' && (
                <AdminOverviewTab stats={stats} transactions={transactions} />
              )}

              {/* VERIFICATION TAB */}
              {activeTab === 'verification' && (
                <AdminVerificationTab 
                  pendingSitters={pendingSitters} 
                  reviewSitter={reviewSitter} 
                  setReviewSitter={setReviewSitter} 
                  handleVerifySitter={handleVerifySitter} 
                />
              )}

              {/* USERS TAB */}
              {activeTab === 'users' && (
                <AdminUsersTab 
                  usersList={usersList} 
                  handleToggleBlockUser={handleToggleBlockUser} 
                />
              )}

              {/* TRANSACTIONS TAB */}
              {activeTab === 'transactions' && (
                <AdminTransactionsTab transactions={transactions} />
              )}

            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
