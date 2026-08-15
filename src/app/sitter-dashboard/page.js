'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useApp } from '../../context/AppContext';
import api from '../../services/api';
import { Briefcase, Calendar, DollarSign, User as UserIcon, Upload, Check, X, ShieldAlert, Sparkles, CheckCircle } from 'lucide-react';

export default function SitterDashboard() {
  const { user, profile, fetchSubProfile } = useApp();
  const router = useRouter();

  // Tab control: 'overview', 'jobs-feed', 'my-applications', 'schedule', 'earnings', 'profile'
  const [activeTab, setActiveTab] = useState('overview');

  // Input states (Sitter settings)
  const [about, setAbout] = useState('');
  const [experienceYears, setExperienceYears] = useState(1);
  const [hourlyRate, setHourlyRate] = useState(150);
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('FEMALE');
  const [skillsText, setSkillsText] = useState('');
  const [languagesText, setLanguagesText] = useState('');

  // Input states (Verification uploads)
  const [nidNumber, setNidNumber] = useState('');
  const [nidFrontImage, setNidFrontImage] = useState('');
  const [nidBackImage, setNidBackImage] = useState('');
  const [selfieImage, setSelfieImage] = useState('');
  const [policeClearanceImage, setPoliceClearanceImage] = useState('');

  // Feed and booking list data states
  const [availableJobs, setAvailableJobs] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [earningsHistory, setEarningsHistory] = useState([]);

  // Control state
  const [loadingData, setLoadingData] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(null); // Field name being uploaded
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Route security
  useEffect(() => {
    if (user && user.role !== 'BABYSITTER') {
      router.push('/');
    }
  }, [user]);

  // Load sitter tables
  const loadDashboardData = async () => {
    if (!user) return;
    setLoadingData(true);
    try {
      // 1. Fetch available jobs
      const jobsRes = await api.get('/job-post');
      setAvailableJobs(jobsRes.data || []);

      // 2. Fetch sitter's bookings
      const bookingsRes = await api.get('/bookings');
      const sitterBookings = bookingsRes.data || [];
      setMyBookings(sitterBookings);

      // Filter bookings that are PAID to calculate earnings
      const paidBookings = sitterBookings.filter(b => b.paymentStatus === 'PAID');
      setEarningsHistory(paidBookings);
      
      // Calculate applications
      const apps = (jobsRes.data || []).filter(j => 
        (j.applicants || []).some(app => app.sitter === user._id || app.sitter?._id === user._id)
      ).map(j => {
        const myApp = j.applicants.find(app => app.sitter === user._id || app.sitter?._id === user._id);
        return {
          jobId: j._id,
          title: j.title,
          location: j.location,
          hourlyRate: j.hourlyRate,
          status: myApp.status,
          appliedAt: myApp.appliedAt
        };
      });
      setMyApplications(apps);
    } catch (err) {
      console.warn('Backend tables unavailable, loading mock dashboard state.', err.message);
      // Fallback mocks
      setAvailableJobs([
        {
          _id: 'j1',
          title: 'Urgent Babysitter needed for toddler',
          description: 'Looking for a kind sitter to take care of a 3yo child for 2 days. Must be vaccinated.',
          hourlyRate: 150,
          location: 'Dhanmondi, Dhaka',
          jobType: 'PART_TIME',
          status: 'OPEN'
        }
      ]);
      setMyBookings([
        {
          _id: 'b1',
          parent: { name: 'Rahat Hossain' },
          startDate: '2026-08-15',
          endDate: '2026-08-16',
          hourlyRate: 150,
          totalHours: 16,
          totalAmount: 2400,
          status: 'ACCEPTED',
          paymentStatus: 'PAID'
        }
      ]);
      setEarningsHistory([
        {
          _id: 'b1',
          parent: { name: 'Rahat Hossain' },
          endDate: '2026-08-16',
          totalAmount: 2400
        }
      ]);
      setMyApplications([
        {
          jobId: 'j1',
          title: 'Urgent Babysitter needed for toddler',
          location: 'Dhanmondi, Dhaka',
          hourlyRate: 150,
          status: 'PENDING',
          appliedAt: new Date()
        }
      ]);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [user, activeTab]);

  // Sync profile settings inputs when profile context loads
  useEffect(() => {
    if (profile) {
      setAbout(profile.about || '');
      setExperienceYears(profile.experienceYears || 1);
      setHourlyRate(profile.hourlyRate || 150);
      setAddress(profile.address || '');
      setGender(profile.gender || 'FEMALE');
      setSkillsText(profile.skills?.join(', ') || '');
      setLanguagesText(profile.languages?.join(', ') || '');
      setNidNumber(profile.nidNumber || '');
      setNidFrontImage(profile.nidFrontImage || '');
      setNidBackImage(profile.nidBackImage || '');
      setSelfieImage(profile.selfieImage || '');
      setPoliceClearanceImage(profile.policeClearanceImage || '');
    }
  }, [profile]);

  // Handle mock file uploads calling the actual backend /upload multi-part API
  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingFile(fieldName);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append('files', file); // API expects key 'files'

    try {
      const response = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // Backend returns array of URLs in data
      const url = response.data[0];
      
      if (fieldName === 'nidFrontImage') setNidFrontImage(url);
      else if (fieldName === 'nidBackImage') setNidBackImage(url);
      else if (fieldName === 'selfieImage') setSelfieImage(url);
      else if (fieldName === 'policeClearanceImage') setPoliceClearanceImage(url);

      setSuccessMsg(`File uploaded successfully for ${fieldName}!`);
    } catch (err) {
      setErrorMsg(err.message || 'File upload failed.');
    } finally {
      setUploadingFile(null);
    }
  };

  const handleApply = async (jobId) => {
    if (!profile || profile.verificationStatus !== 'VERIFIED') {
      alert('Only Verified Babysitters are authorized to apply for job posts. Please submit verification documents in your settings tab.');
      return;
    }
    try {
      await api.post(`/job-post/${jobId}/apply`);
      setSuccessMsg('Job application submitted successfully!');
      loadDashboardData();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit application.');
    }
  };

  const handleUpdateBookingStatus = async (bookingId, status) => {
    try {
      await api.patch(`/bookings/${bookingId}/status`, { status });
      setSuccessMsg(`Booking status updated to ${status}!`);
      loadDashboardData();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update booking status.');
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        about,
        experienceYears: Number(experienceYears),
        hourlyRate: Number(hourlyRate),
        address,
        gender,
        skills: skillsText.split(',').map(s => s.trim()).filter(Boolean),
        languages: languagesText.split(',').map(l => l.trim()).filter(Boolean),
        nidNumber,
        nidFrontImage,
        nidBackImage,
        selfieImage,
        policeClearanceImage
      };

      await api.patch(`/sitter-profile/${user._id}`, payload);
      await fetchSubProfile(user);
      setSuccessMsg('Profile settings updated successfully!');
    } catch (err) {
      setErrorMsg(err.message || 'Profile update failed.');
    }
  };

  const getTotalEarnings = () => {
    return earningsHistory.reduce((sum, b) => sum + (b.totalAmount || b.hourlyRate * b.totalHours || 0), 0);
  };

  if (!user) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <div className="container flex-center" style={{ flex: 1, flexDirection: 'column', gap: '16px' }}>
          <ShieldAlert size={48} color="var(--color-danger)" />
          <h3>Log In Required</h3>
          <p>Please log in as a Babysitter to view this dashboard.</p>
          <button onClick={() => router.push('/auth')} className="btn btn-primary">Log In</button>
        </div>
        <Footer />
      </div>
    );
  }

  const verStatus = profile?.verificationStatus || 'PENDING';

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
                  background: 'var(--color-secondary)',
                  color: 'white',
                  fontSize: '24px',
                  fontFamily: 'var(--font-header)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 10px auto',
                  border: '2px solid var(--color-white)',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  {user.name.charAt(0)}
                </div>
                <h4 style={{ fontSize: '16px' }}>{user.name}</h4>
                <div style={{ marginTop: '6px' }}>
                  <span className={`badge ${verStatus === 'VERIFIED' ? 'badge-verified' : verStatus === 'PENDING' ? 'badge-pending' : 'badge-danger'}`} style={{ fontSize: '10px' }}>
                    {verStatus}
                  </span>
                </div>
              </div>

              <ul className="sidebar-menu">
                <li className={`sidebar-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
                  <DollarSign size={18} /> Overview
                </li>
                <li className={`sidebar-item ${activeTab === 'jobs-feed' ? 'active' : ''}`} onClick={() => setActiveTab('jobs-feed')}>
                  <Briefcase size={18} /> Browse Jobs Feed
                </li>
                <li className={`sidebar-item ${activeTab === 'my-applications' ? 'active' : ''}`} onClick={() => setActiveTab('my-applications')}>
                  <FileText size={18} /> My Applications
                </li>
                <li className={`sidebar-item ${activeTab === 'schedule' ? 'active' : ''}`} onClick={() => setActiveTab('schedule')}>
                  <Calendar size={18} /> Booking Requests
                </li>
                <li className={`sidebar-item ${activeTab === 'earnings' ? 'active' : ''}`} onClick={() => setActiveTab('earnings')}>
                  <DollarSign size={18} /> Payments History
                </li>
                <li className={`sidebar-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => { setActiveTab('profile'); setErrorMsg(null); setSuccessMsg(null); }}>
                  <UserIcon size={18} /> Profile & Uploads
                </li>
              </ul>
            </div>

            {/* Content Area */}
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
                  {/* Earnings card row */}
                  <div className="grid-3">
                    <div className="card" style={{ background: 'linear-gradient(135deg, rgba(109,193,160,0.1) 0%, rgba(255,255,255,1) 100%)', textAlign: 'center' }}>
                      <h4 style={{ color: 'var(--color-tertiary-dark)', fontSize: '16px' }}>Total Earnings</h4>
                      <div style={{ fontSize: '36px', fontWeight: '800', margin: '10px 0' }}>৳{getTotalEarnings()}</div>
                      <button onClick={() => setActiveTab('earnings')} className="btn btn-outline" style={{ padding: '6px 16px', fontSize: '11px', boxShadow: 'none' }}>View Payouts</button>
                    </div>

                    <div className="card" style={{ background: 'linear-gradient(135deg, rgba(185,150,254,0.1) 0%, rgba(255,255,255,1) 100%)', textAlign: 'center' }}>
                      <h4 style={{ color: 'var(--color-secondary-dark)', fontSize: '16px' }}>Direct Bookings</h4>
                      <div style={{ fontSize: '36px', fontWeight: '800', margin: '10px 0' }}>
                        {myBookings.filter(b => b.status === 'PENDING').length}
                      </div>
                      <button onClick={() => setActiveTab('schedule')} className="btn btn-outline" style={{ padding: '6px 16px', fontSize: '11px', boxShadow: 'none' }}>View Requests</button>
                    </div>

                    <div className="card" style={{ background: 'linear-gradient(135deg, rgba(255,162,188,0.1) 0%, rgba(255,255,255,1) 100%)', textAlign: 'center' }}>
                      <h4 style={{ color: 'var(--color-primary-dark)', fontSize: '16px' }}>Verification</h4>
                      <div style={{ margin: '14px 0 10px 0', fontSize: '13px' }}>
                        <span className={`badge ${verStatus === 'VERIFIED' ? 'badge-verified' : verStatus === 'PENDING' ? 'badge-pending' : 'badge-danger'}`} style={{ padding: '6px 14px' }}>
                          Status: {verStatus}
                        </span>
                        <p style={{ fontSize: '11px', color: 'var(--color-body)', marginTop: '8px' }}>
                          {verStatus === 'VERIFIED' ? 'Approved for applications' : 'Verification documents required'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Verification Banner helper if not verified */}
                  {verStatus !== 'VERIFIED' && (
                    <div className="card" style={{ display: 'flex', gap: '20px', background: 'rgba(255, 193, 71, 0.08)', border: '3px solid var(--color-quaternary)', alignItems: 'center' }}>
                      <div style={{ fontSize: '36px' }}>📝</div>
                      <div>
                        <h4 style={{ fontSize: '16px' }}>Submit Document verification</h4>
                        <p style={{ color: 'var(--color-body)', fontSize: '13px', marginTop: '4px' }}>
                          To apply for jobs, you must upload your NID number, front/back images, a selfie, and police clearance certificate in your settings profile.
                        </p>
                        <button onClick={() => setActiveTab('profile')} className="btn btn-secondary" style={{ padding: '6px 16px', fontSize: '11px', marginTop: '10px', boxShadow: 'none' }}>
                          Upload Documents
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* BROWSE JOBS FEED TAB */}
              {activeTab === 'jobs-feed' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <h3 style={{ fontSize: '22px' }}>Available Jobs Feed</h3>
                  
                  {verStatus !== 'VERIFIED' && (
                    <div style={{
                      background: 'rgba(255, 110, 110, 0.1)',
                      border: '1px solid var(--color-danger)',
                      color: 'var(--color-danger)',
                      padding: '12px',
                      borderRadius: '8px',
                      fontSize: '13px'
                    }}>
                      ⚠️ Job Application access is locked. Submit and get verification documents approved by admin first.
                    </div>
                  )}

                  {availableJobs.length === 0 ? (
                    <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--color-body)' }}>
                      No active childcare jobs posted by parents.
                    </div>
                  ) : (
                    availableJobs.map((job) => (
                      <div key={job._id} className="card" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-gray-border)', paddingBottom: '12px', marginBottom: '16px' }}>
                          <div>
                            <h4 style={{ fontSize: '18px' }}>{job.title}</h4>
                            <p style={{ fontSize: '12px', color: 'var(--color-body)', marginTop: '4px' }}>Location: {job.location} | Hourly budget: ৳{job.hourlyRate}</p>
                          </div>
                          <span style={{ fontSize: '20px', fontWeight: '800', color: 'var(--color-secondary-dark)' }}>৳{job.hourlyRate}/hr</span>
                        </div>

                        <p style={{ color: 'var(--color-body)', fontSize: '14px', marginBottom: '20px' }}>{job.description}</p>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span className="badge badge-pending" style={{ textTransform: 'uppercase' }}>{job.jobType}</span>
                          <button 
                            disabled={verStatus !== 'VERIFIED'}
                            onClick={() => handleApply(job._id)}
                            className="btn btn-secondary" 
                            style={{ padding: '8px 24px', fontSize: '13px', boxShadow: 'none' }}
                          >
                            Apply to Job
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* MY APPLICATIONS TAB */}
              {activeTab === 'my-applications' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <h3 style={{ fontSize: '22px' }}>My Applied Jobs</h3>
                  {myApplications.length === 0 ? (
                    <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--color-body)' }}>
                      You haven't applied to any job postings yet.
                    </div>
                  ) : (
                    myApplications.map((app, i) => (
                      <div key={i} className="card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h4 style={{ fontSize: '16px' }}>{app.title}</h4>
                          <p style={{ fontSize: '12px', color: 'var(--color-body)', marginTop: '4px' }}>Location: {app.location} | Budget: ৳{app.hourlyRate}/hr</p>
                        </div>
                        <span className={`badge ${app.status === 'ACCEPTED' ? 'badge-verified' : app.status === 'PENDING' ? 'badge-pending' : 'badge-danger'}`}>
                          {app.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* BOOKING REQUESTS SCHEDULE TAB */}
              {activeTab === 'schedule' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <h3 style={{ fontSize: '22px' }}>My Bookings & Hires</h3>
                  {myBookings.length === 0 ? (
                    <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--color-body)' }}>
                      No current hiring contracts.
                    </div>
                  ) : (
                    myBookings.map((b) => (
                      <div key={b._id} className="card" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-gray-border)', paddingBottom: '12px', marginBottom: '16px' }}>
                          <div>
                            <h4 style={{ fontSize: '18px' }}>Parent: {b.parent?.name || 'Parent'}</h4>
                            <p style={{ fontSize: '12px', color: 'var(--color-body)' }}>Dates: {b.startDate} to {b.endDate}</p>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                            <span className={`badge ${b.status === 'ACCEPTED' ? 'badge-verified' : b.status === 'COMPLETED' ? 'badge-verified' : 'badge-pending'}`}>{b.status}</span>
                            <span className={`badge ${b.paymentStatus === 'PAID' ? 'badge-verified' : 'badge-pending'}`} style={{ fontSize: '10px' }}>
                              Payment: {b.paymentStatus}
                            </span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <span style={{ fontSize: '12px', color: 'var(--color-body)' }}>Salary payout:</span>
                            <div style={{ fontSize: '20px', fontWeight: '800' }}>৳{b.totalAmount || b.hourlyRate * b.totalHours}</div>
                          </div>
                          
                          <div style={{ display: 'flex', gap: '8px' }}>
                            {/* Action for direct pending requests */}
                            {b.status === 'PENDING' && (
                              <>
                                <button 
                                  onClick={() => handleUpdateBookingStatus(b._id, 'ACCEPTED')}
                                  className="btn btn-tertiary" 
                                  style={{ padding: '8px 16px', fontSize: '12px', boxShadow: 'none' }}
                                >
                                  Accept request
                                </button>
                                <button 
                                  onClick={() => handleUpdateBookingStatus(b._id, 'CANCELLED')}
                                  className="btn btn-outline" 
                                  style={{ padding: '8px 16px', fontSize: '12px', boxShadow: 'none', border: '1.5px solid var(--color-secondary)' }}
                                >
                                  Decline
                                </button>
                              </>
                            )}

                            {/* Action to complete ongoing Accepted hiring */}
                            {b.status === 'ACCEPTED' && (
                              <button 
                                onClick={() => handleUpdateBookingStatus(b._id, 'COMPLETED')}
                                className="btn btn-secondary" 
                                style={{ padding: '8px 16px', fontSize: '12px', boxShadow: 'none' }}
                              >
                                Mark as Completed
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* PAYMENTS HISTORY TAB */}
              {activeTab === 'earnings' && (
                <div className="card" style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>Earnings & Payouts</h3>
                  {earningsHistory.length === 0 ? (
                    <p style={{ color: 'var(--color-body)', fontSize: '14px', textAlign: 'center', padding: '20px' }}>No payments received yet.</p>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                        <thead>
                          <tr style={{ borderBottom: '2px solid var(--color-gray-border)', color: 'var(--color-body)' }}>
                            <th style={{ padding: '12px 8px' }}>Client Parent</th>
                            <th style={{ padding: '12px 8px' }}>Date</th>
                            <th style={{ padding: '12px 8px' }}>Amount received</th>
                            <th style={{ padding: '12px 8px' }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {earningsHistory.map((earn) => (
                            <tr key={earn._id} style={{ borderBottom: '1px solid var(--color-gray-border)' }}>
                              <td style={{ padding: '12px 8px', fontWeight: '700' }}>{earn.parent?.name || 'Parent'}</td>
                              <td style={{ padding: '12px 8px' }}>{earn.endDate}</td>
                              <td style={{ padding: '12px 8px', color: 'var(--color-success)', fontWeight: '700' }}>+৳{earn.totalAmount || earn.hourlyRate * earn.totalHours}</td>
                              <td style={{ padding: '12px 8px' }}>
                                <span className="badge badge-verified">Received</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* SITTER PROFILE SETUP / UPLOADS TAB */}
              {activeTab === 'profile' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                  
                  {/* Text Details Settings */}
                  <div className="card" style={{ padding: '32px' }}>
                    <h3 style={{ fontSize: '22px', marginBottom: '24px' }}>Profile Information</h3>
                    <form onSubmit={handleUpdateProfile}>
                      <div className="form-group">
                        <label className="form-label">Contact Address</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Dhanmondi, Dhaka" 
                          className="form-control"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">About / Bio</label>
                        <textarea 
                          rows="4" 
                          placeholder="Tell parents about your childcare style, expertise..."
                          className="form-control"
                          value={about}
                          onChange={(e) => setAbout(e.target.value)}
                        ></textarea>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Experience Years</label>
                          <input 
                            type="number" 
                            className="form-control"
                            value={experienceYears}
                            onChange={(e) => setExperienceYears(Number(e.target.value))}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Hourly Rate Charge (৳)</label>
                          <input 
                            type="number" 
                            className="form-control"
                            value={hourlyRate}
                            onChange={(e) => setHourlyRate(Number(e.target.value))}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Skills (comma separated)</label>
                        <input 
                          type="text" 
                          placeholder="e.g. CPR Certified, Infant Care, Tutoring" 
                          className="form-control"
                          value={skillsText}
                          onChange={(e) => setSkillsText(e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Languages (comma separated)</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Bangla, English" 
                          className="form-control"
                          value={languagesText}
                          onChange={(e) => setLanguagesText(e.target.value)}
                        />
                      </div>

                      {/* Verification Documents Upload Fields */}
                      <h3 style={{ fontSize: '20px', margin: '30px 0 16px 0', borderTop: '1px solid var(--color-gray-border)', paddingTop: '20px' }}>
                        Verification Uploads
                      </h3>

                      <div className="form-group">
                        <label className="form-label">NID Card Number</label>
                        <input 
                          type="text" 
                          placeholder="NID number" 
                          className="form-control"
                          value={nidNumber}
                          onChange={(e) => setNidNumber(e.target.value)}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <div className="form-group">
                          <label className="form-label">NID Front Image</label>
                          <input 
                            type="file" 
                            className="form-control" 
                            onChange={(e) => handleFileUpload(e, 'nidFrontImage')}
                          />
                          {uploadingFile === 'nidFrontImage' && <span style={{ fontSize: '11px' }}>Uploading...</span>}
                          {nidFrontImage && (
                            <img src={nidFrontImage} style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px', marginTop: '10px', border: '1px solid var(--color-gray-border)' }} />
                          )}
                        </div>

                        <div className="form-group">
                          <label className="form-label">NID Back Image</label>
                          <input 
                            type="file" 
                            className="form-control" 
                            onChange={(e) => handleFileUpload(e, 'nidBackImage')}
                          />
                          {uploadingFile === 'nidBackImage' && <span style={{ fontSize: '11px' }}>Uploading...</span>}
                          {nidBackImage && (
                            <img src={nidBackImage} style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px', marginTop: '10px', border: '1px solid var(--color-gray-border)' }} />
                          )}
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <div className="form-group">
                          <label className="form-label">Selfie Image</label>
                          <input 
                            type="file" 
                            className="form-control" 
                            onChange={(e) => handleFileUpload(e, 'selfieImage')}
                          />
                          {uploadingFile === 'selfieImage' && <span style={{ fontSize: '11px' }}>Uploading...</span>}
                          {selfieImage && (
                            <img src={selfieImage} style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px', marginTop: '10px', border: '1px solid var(--color-gray-border)' }} />
                          )}
                        </div>

                        <div className="form-group">
                          <label className="form-label">Police Clearance Certificate</label>
                          <input 
                            type="file" 
                            className="form-control" 
                            onChange={(e) => handleFileUpload(e, 'policeClearanceImage')}
                          />
                          {uploadingFile === 'policeClearanceImage' && <span style={{ fontSize: '11px' }}>Uploading...</span>}
                          {policeClearanceImage && (
                            <img src={policeClearanceImage} style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px', marginTop: '10px', border: '1px solid var(--color-gray-border)' }} />
                          )}
                        </div>
                      </div>

                      <button type="submit" className="btn btn-secondary" style={{ width: '100%', marginTop: '20px', padding: '14px' }}>
                        Submit Profile & Documents
                      </button>
                    </form>
                  </div>
                  
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
