'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useApp } from '../../context/AppContext';
import api from '../../services/api';
import { Shield, Users, ShieldAlert, Award, FileText, Check, X, ShieldCheck } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useApp();
  const router = useRouter();

  // Tab control: 'overview', 'verification', 'users', 'transactions'
  const [activeTab, setActiveTab] = useState('overview');

  // Review modal control
  const [reviewSitter, setReviewSitter] = useState(null);

  // Table lists data states
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
      // Placeholders
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
      // Endpoint is PATCH /sitter-profile/:userId/verify
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
      // Calls PATCH /user/:userId to toggle status
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
          <h3>Admin Auth Required</h3>
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
            <div className="sidebar-card">
              <div style={{ textAlign: 'center', marginBottom: '24px', borderBottom: '1px solid var(--color-gray-border)', paddingBottom: '16px' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'var(--color-secondary-dark)',
                  color: 'white',
                  fontSize: '24px',
                  fontFamily: 'var(--font-header)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 10px auto',
                  border: '3px solid var(--color-primary)'
                }}>
                  A
                </div>
                <h4 style={{ fontSize: '16px' }}>{user.name}</h4>
                <span style={{ fontSize: '11px', color: 'var(--color-body)', fontWeight: '600', textTransform: 'uppercase' }}>Administrator</span>
              </div>

              <ul className="sidebar-menu">
                <li className={`sidebar-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
                  <Shield size={18} /> Overview
                </li>
                <li className={`sidebar-item ${activeTab === 'verification' ? 'active' : ''}`} onClick={() => setActiveTab('verification')}>
                  <Award size={18} /> Verification Requests ({pendingSitters.length})
                </li>
                <li className={`sidebar-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
                  <Users size={18} /> User Management
                </li>
                <li className={`sidebar-item ${activeTab === 'transactions' ? 'active' : ''}`} onClick={() => setActiveTab('transactions')}>
                  <FileText size={18} /> Transactions Audit
                </li>
              </ul>
            </div>

            {/* Dashboard Content */}
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                  {/* Summary Counters */}
                  <div className="grid-4">
                    <div className="card" style={{ textAlign: 'center' }}>
                      <h4 style={{ color: 'var(--color-body)', fontSize: '13px' }}>Total Accounts</h4>
                      <div style={{ fontSize: '32px', fontWeight: '800', margin: '8px 0' }}>{stats.totalUsers}</div>
                    </div>
                    <div className="card" style={{ textAlign: 'center' }}>
                      <h4 style={{ color: 'var(--color-primary-dark)', fontSize: '13px' }}>Parents</h4>
                      <div style={{ fontSize: '32px', fontWeight: '800', margin: '8px 0' }}>{stats.parents}</div>
                    </div>
                    <div className="card" style={{ textAlign: 'center' }}>
                      <h4 style={{ color: 'var(--color-secondary-dark)', fontSize: '13px' }}>Babysitters</h4>
                      <div style={{ fontSize: '32px', fontWeight: '800', margin: '8px 0' }}>{stats.sitters}</div>
                    </div>
                    <div className="card" style={{ textAlign: 'center' }}>
                      <h4 style={{ color: 'var(--color-tertiary-dark)', fontSize: '13px' }}>Verified Sitters</h4>
                      <div style={{ fontSize: '32px', fontWeight: '800', margin: '8px 0' }}>{stats.verifiedSitters}</div>
                    </div>
                  </div>

                  {/* Commission audit summaries */}
                  <div className="card" style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>Commission Metrics</h3>
                    <p style={{ color: 'var(--color-body)', fontSize: '14px', marginBottom: '20px' }}>
                      Audit log of completed transactions and estimated commission payout amounts.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div style={{ background: 'var(--color-bg-light)', border: '2px solid var(--color-gray-border)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
                        <div style={{ fontSize: '13px', color: 'var(--color-body)' }}>Estimated Volume processed</div>
                        <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--color-dark)', marginTop: '6px' }}>
                          ৳{transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0)}
                        </div>
                      </div>
                      <div style={{ background: 'var(--color-bg-light)', border: '2px solid var(--color-gray-border)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
                        <div style={{ fontSize: '13px', color: 'var(--color-body)' }}>Est. Platform Revenue (10% fee)</div>
                        <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--color-success)', marginTop: '6px' }}>
                          ৳{(transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0) * 0.1).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SITTER VERIFICATION PANEL TAB */}
              {activeTab === 'verification' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <h3 style={{ fontSize: '22px' }}>Sitter Verification Requests</h3>
                  {pendingSitters.length === 0 ? (
                    <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--color-body)' }}>
                      No babysitters are currently awaiting document verification approvals.
                    </div>
                  ) : (
                    pendingSitters.map((sitter) => (
                      <div key={sitter._id} className="card" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-gray-border)', paddingBottom: '12px', marginBottom: '16px' }}>
                          <div>
                            <h4 style={{ fontSize: '18px' }}>{sitter.user?.name || 'Babysitter Candidate'}</h4>
                            <p style={{ fontSize: '12px', color: 'var(--color-body)' }}>Email: {sitter.user?.email} | NID: {sitter.nidNumber}</p>
                          </div>
                          <button 
                            onClick={() => setReviewSitter(sitter)}
                            className="btn btn-secondary" 
                            style={{ padding: '6px 14px', fontSize: '12px', boxShadow: 'none' }}
                          >
                            Review Documents
                          </button>
                        </div>

                        {/* Expandable Document previewer */}
                        {reviewSitter?._id === sitter._id && (
                          <div style={{ background: 'var(--color-bg-light)', border: '2px dashed var(--color-gray-border)', padding: '20px', borderRadius: '12px', marginTop: '16px' }}>
                            <h5 style={{ fontSize: '14px', marginBottom: '12px' }}>Submitted Document Previews:</h5>
                            
                            <div className="grid-3" style={{ gap: '16px', marginBottom: '24px' }}>
                              <div>
                                <div style={{ fontSize: '11px', color: 'var(--color-body)', marginBottom: '4px' }}>NID Front Image</div>
                                <img src={sitter.nidFrontImage} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--color-gray-border)' }} />
                              </div>
                              <div>
                                <div style={{ fontSize: '11px', color: 'var(--color-body)', marginBottom: '4px' }}>NID Back Image</div>
                                <img src={sitter.nidBackImage} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--color-gray-border)' }} />
                              </div>
                              <div>
                                <div style={{ fontSize: '11px', color: 'var(--color-body)', marginBottom: '4px' }}>Selfie Image</div>
                                <img src={sitter.selfieImage} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--color-gray-border)' }} />
                              </div>
                            </div>
                            
                            <div style={{ marginBottom: '24px' }}>
                              <div style={{ fontSize: '11px', color: 'var(--color-body)', marginBottom: '4px' }}>Police Clearance Certificate</div>
                              <img src={sitter.policeClearanceImage} style={{ width: '100%', maxHeight: '300px', objectFit: 'contain', borderRadius: '8px', border: '1px solid var(--color-gray-border)' }} />
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                              <button 
                                onClick={() => handleVerifySitter(sitter.user?._id || sitter.user, 'VERIFIED')}
                                className="btn btn-tertiary" 
                                style={{ padding: '8px 20px', fontSize: '12px', boxShadow: 'none' }}
                              >
                                <Check size={16} /> Approve Verification
                              </button>
                              <button 
                                onClick={() => handleVerifySitter(sitter.user?._id || sitter.user, 'REJECTED')}
                                className="btn btn-primary" 
                                style={{ padding: '8px 20px', fontSize: '12px', boxShadow: 'none' }}
                              >
                                <X size={16} /> Reject Request
                              </button>
                              <button 
                                type="button" 
                                onClick={() => setReviewSitter(null)}
                                className="btn btn-outline" 
                                style={{ padding: '8px 20px', fontSize: '12px', boxShadow: 'none', border: '1.5px solid var(--color-secondary)' }}
                              >
                                Close Preview
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* USER MANAGEMENT TAB */}
              {activeTab === 'users' && (
                <div className="card" style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>Registered Accounts</h3>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid var(--color-gray-border)', color: 'var(--color-body)' }}>
                          <th style={{ padding: '12px 8px' }}>User Details</th>
                          <th style={{ padding: '12px 8px' }}>Role</th>
                          <th style={{ padding: '12px 8px' }}>Status</th>
                          <th style={{ padding: '12px 8px' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {usersList.map((usr) => (
                          <tr key={usr._id} style={{ borderBottom: '1px solid var(--color-gray-border)' }}>
                            <td style={{ padding: '12px 8px' }}>
                              <div style={{ fontWeight: '700' }}>{usr.name}</div>
                              <div style={{ fontSize: '12px', color: 'var(--color-body)' }}>{usr.email}</div>
                            </td>
                            <td style={{ padding: '12px 8px', textTransform: 'uppercase', fontSize: '12px' }}>{usr.role}</td>
                            <td style={{ padding: '12px 8px' }}>
                              <span className={`badge ${usr.status === 'ACTIVE' ? 'badge-verified' : 'badge-danger'}`}>
                                {usr.status}
                              </span>
                            </td>
                            <td style={{ padding: '12px 8px' }}>
                              {usr.role !== 'SUPER_ADMIN' && (
                                <button 
                                  onClick={() => handleToggleBlockUser(usr._id, usr.status)}
                                  className={`btn ${usr.status === 'ACTIVE' ? 'btn-primary' : 'btn-tertiary'}`}
                                  style={{ padding: '6px 14px', fontSize: '11px', boxShadow: 'none' }}
                                >
                                  {usr.status === 'ACTIVE' ? 'Block Account' : 'Unblock'}
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TRANSACTIONS AUDIT TAB */}
              {activeTab === 'transactions' && (
                <div className="card" style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>Completed Payments Log</h3>
                  {transactions.length === 0 ? (
                    <p style={{ color: 'var(--color-body)', fontSize: '14px', textAlign: 'center', padding: '20px' }}>No payments logged yet.</p>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                        <thead>
                          <tr style={{ borderBottom: '2px solid var(--color-gray-border)', color: 'var(--color-body)' }}>
                            <th style={{ padding: '12px 8px' }}>Hiring Parent</th>
                            <th style={{ padding: '12px 8px' }}>Babysitter</th>
                            <th style={{ padding: '12px 8px' }}>Tx amount</th>
                            <th style={{ padding: '12px 8px' }}>Admin Fee (10%)</th>
                            <th style={{ padding: '12px 8px' }}>Timestamp</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transactions.map((tx) => (
                            <tr key={tx._id} style={{ borderBottom: '1px solid var(--color-gray-border)' }}>
                              <td style={{ padding: '12px 8px' }}>{tx.parent?.name || 'Parent'}</td>
                              <td style={{ padding: '12px 8px' }}>{tx.sitter?.name || 'Sitter'}</td>
                              <td style={{ padding: '12px 8px', fontWeight: '700' }}>৳{tx.amount}</td>
                              <td style={{ padding: '12px 8px', color: 'var(--color-success)', fontWeight: '700' }}>৳{(tx.amount * 0.1).toFixed(2)}</td>
                              <td style={{ padding: '12px 8px', fontSize: '12px', color: 'var(--color-body)' }}>{new Date(tx.createdAt).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
