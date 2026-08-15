'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import PaymentModal from '../../components/PaymentModal';
import { useApp } from '../../context/AppContext';
import api from '../../services/api';
import { Briefcase, Calendar, MessageSquare, User as UserIcon, Plus, FileText, Check, X, ShieldAlert, Star, LogIn } from 'lucide-react';

export default function ParentDashboard() {
  const { user, profile, fetchSubProfile, logout } = useApp();
  const router = useRouter();

  // Tab control: 'overview', 'create-job', 'my-jobs', 'bookings', 'settings'
  const [activeTab, setActiveTab] = useState('overview');

  // Stripe checkout modal control
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  // Form states (Job creation)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hourlyRate, setHourlyRate] = useState(150);
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('09:00 AM');
  const [endTime, setEndTime] = useState('05:00 PM');
  const [jobType, setJobType] = useState('PART_TIME');
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [childGender, setChildGender] = useState('MALE');

  // Form states (Profile Settings)
  const [address, setAddress] = useState('');
  const [parentChildName, setParentChildName] = useState('');
  const [parentChildAge, setParentChildAge] = useState('');
  const [parentChildGender, setParentChildGender] = useState('FEMALE');
  const [expectedHourlyBudget, setExpectedHourlyBudget] = useState(150);

  // Review states
  const [reviewBookingId, setReviewBookingId] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  // Dashboard list data states
  const [myJobs, setMyJobs] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Route security: redirect if not a parent
  useEffect(() => {
    if (user && user.role !== 'PARENT') {
      router.push('/');
    }
  }, [user]);

  // Load dashboard tables
  const loadDashboardData = async () => {
    if (!user) return;
    setLoadingData(true);
    try {
      // 1. Fetch parent's posted jobs
      const jobsRes = await api.get('/job-post');
      // Filter parent's jobs
      const parentJobs = (jobsRes.data || []).filter(j => j.parent === user._id || j.parent?._id === user._id);
      setMyJobs(parentJobs);

      // 2. Fetch parent's bookings
      const bookingsRes = await api.get('/bookings');
      setMyBookings(bookingsRes.data || []);
    } catch (err) {
      console.warn('Backend tables unavailable, loading mock dashboard state.', err.message);
      // Placeholders
      setMyJobs([
        {
          _id: 'j1',
          title: 'Urgent Babysitter needed for toddler',
          description: 'Looking for a kind sitter to take care of a 3yo child for 2 days.',
          hourlyRate: 150,
          location: 'Dhanmondi, Dhaka',
          jobType: 'PART_TIME',
          status: 'OPEN',
          applicants: [
            {
              sitter: { _id: 'sitter1', name: 'Jannat ul Ferdous' },
              status: 'PENDING',
              appliedAt: new Date()
            }
          ]
        }
      ]);
      setMyBookings([
        {
          _id: 'b1',
          sitter: { name: 'Jannat ul Ferdous' },
          startDate: '2026-08-15',
          endDate: '2026-08-16',
          hourlyRate: 150,
          totalHours: 16,
          totalAmount: 2400,
          status: 'ACCEPTED',
          paymentStatus: 'PENDING'
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
      setAddress(profile.address || '');
      setParentChildName(profile.childName || '');
      setParentChildAge(profile.childAge || '');
      setParentChildGender(profile.childGender || 'FEMALE');
      setExpectedHourlyBudget(profile.expectedHourlyBudget || 150);
    }
  }, [profile]);

  const handlePostJob = async (e) => {
    e.preventDefault();
    if (!title || !description || !location || !startDate || !endDate) {
      setErrorMsg('Please fill in all required job fields.');
      return;
    }
    setErrorMsg(null);
    try {
      const payload = {
        title,
        description,
        hourlyRate: Number(hourlyRate),
        location,
        startDate,
        endDate,
        startTime,
        endTime,
        jobType,
        childName,
        childAge: Number(childAge),
        childGender
      };

      await api.post('/job-post', payload);
      setSuccessMsg('Job post created successfully!');
      // Reset inputs
      setTitle('');
      setDescription('');
      setLocation('');
      setActiveTab('my-jobs');
    } catch (err) {
      setErrorMsg(err.message || 'Job creation failed.');
    }
  };

  const handleApplicantStatus = async (jobId, sitterId, status) => {
    try {
      await api.patch(`/job-post/${jobId}/applicant-status`, { sitterId, status });
      setSuccessMsg(`Applicant status updated to ${status}!`);
      loadDashboardData();
    } catch (err) {
      setErrorMsg(err.message || 'Applicant status update failed.');
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/parent-profile/${user._id}`, {
        address,
        childName: parentChildName,
        childAge: Number(parentChildAge),
        childGender: parentChildGender,
        expectedHourlyBudget: Number(expectedHourlyBudget)
      });
      await fetchSubProfile(user);
      setSuccessMsg('Profile settings updated successfully!');
    } catch (err) {
      setErrorMsg(err.message || 'Profile update failed.');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await api.post('/reviews', {
        booking: reviewBookingId,
        rating: Number(rating),
        comment
      });
      setSuccessMsg('Review submitted successfully! Thank you for your feedback.');
      setReviewBookingId(null);
      setComment('');
      loadDashboardData();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit review.');
    }
  };

  if (!user) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <div className="container flex-center" style={{ flex: 1, flexDirection: 'column', gap: '16px' }}>
          <ShieldAlert size={48} color="var(--color-danger)" />
          <h3>Log In Required</h3>
          <p>Please log in as a Parent to view this dashboard.</p>
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
                  background: 'var(--color-primary)',
                  color: 'white',
                  fontSize: '24px',
                  fontFamily: 'var(--font-header)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 10px auto',
                  border: '3px solid var(--color-dark)'
                }}>
                  {user.name.charAt(0)}
                </div>
                <h4 style={{ fontSize: '16px' }}>{user.name}</h4>
                <span style={{ fontSize: '11px', color: 'var(--color-body)', fontWeight: '600', textTransform: 'uppercase' }}>Parent Account</span>
              </div>

              <ul className="sidebar-menu">
                <li className={`sidebar-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
                  <Calendar size={18} /> Overview
                </li>
                <li className={`sidebar-item ${activeTab === 'create-job' ? 'active' : ''}`} onClick={() => { setActiveTab('create-job'); setErrorMsg(null); setSuccessMsg(null); }}>
                  <Plus size={18} /> Post a Job
                </li>
                <li className={`sidebar-item ${activeTab === 'my-jobs' ? 'active' : ''}`} onClick={() => setActiveTab('my-jobs')}>
                  <Briefcase size={18} /> Job Posts & Applicants
                </li>
                <li className={`sidebar-item ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => setActiveTab('bookings')}>
                  <FileText size={18} /> My Bookings
                </li>
                <li className={`sidebar-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => { setActiveTab('settings'); setErrorMsg(null); setSuccessMsg(null); }}>
                  <UserIcon size={18} /> Profile Settings
                </li>
              </ul>
            </div>

            {/* Dashboard Content Area */}
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
                  {/* Summary grid */}
                  <div className="grid-3">
                    <div className="card" style={{ background: 'linear-gradient(135deg, rgba(255,162,188,0.1) 0%, rgba(255,255,255,1) 100%)', textAlign: 'center' }}>
                      <h4 style={{ color: 'var(--color-primary-dark)', fontSize: '16px' }}>My Job Posts</h4>
                      <div style={{ fontSize: '36px', fontWeight: '800', margin: '10px 0' }}>{myJobs.length}</div>
                      <button onClick={() => setActiveTab('my-jobs')} className="btn btn-outline" style={{ padding: '6px 16px', fontSize: '11px', boxShadow: 'none' }}>View Jobs</button>
                    </div>

                    <div className="card" style={{ background: 'linear-gradient(135deg, rgba(185,150,254,0.1) 0%, rgba(255,255,255,1) 100%)', textAlign: 'center' }}>
                      <h4 style={{ color: 'var(--color-secondary-dark)', fontSize: '16px' }}>Active Bookings</h4>
                      <div style={{ fontSize: '36px', fontWeight: '800', margin: '10px 0' }}>
                        {myBookings.filter(b => b.status === 'ACCEPTED').length}
                      </div>
                      <button onClick={() => setActiveTab('bookings')} className="btn btn-outline" style={{ padding: '6px 16px', fontSize: '11px', boxShadow: 'none' }}>View Bookings</button>
                    </div>

                    <div className="card" style={{ background: 'linear-gradient(135deg, rgba(109,193,160,0.1) 0%, rgba(255,255,255,1) 100%)', textAlign: 'center' }}>
                      <h4 style={{ color: 'var(--color-tertiary-dark)', fontSize: '16px' }}>Hiring Shortcuts</h4>
                      <div style={{ margin: '18px 0 10px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <button onClick={() => setActiveTab('create-job')} className="btn btn-primary" style={{ padding: '8px 12px', fontSize: '12px', width: '100%', boxShadow: 'none' }}>Post a Job</button>
                        <button onClick={() => router.push('/search')} className="btn btn-secondary" style={{ padding: '8px 12px', fontSize: '12px', width: '100%', boxShadow: 'none' }}>Search Sitters</button>
                      </div>
                    </div>
                  </div>

                  {/* Recent Bookings table */}
                  <div className="card" style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>Recent Bookings</h3>
                    {myBookings.length === 0 ? (
                      <p style={{ color: 'var(--color-body)', fontSize: '14px', textAlign: 'center', padding: '20px' }}>No bookings created yet.</p>
                    ) : (
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                          <thead>
                            <tr style={{ borderBottom: '2px solid var(--color-gray-border)', color: 'var(--color-body)' }}>
                              <th style={{ padding: '12px 8px' }}>Sitter</th>
                              <th style={{ padding: '12px 8px' }}>Dates</th>
                              <th style={{ padding: '12px 8px' }}>Budget</th>
                              <th style={{ padding: '12px 8px' }}>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {myBookings.slice(0, 3).map((b) => (
                              <tr key={b._id} style={{ borderBottom: '1px solid var(--color-gray-border)' }}>
                                <td style={{ padding: '12px 8px', fontWeight: '700' }}>{b.sitter?.name || 'Sitter'}</td>
                                <td style={{ padding: '12px 8px' }}>{b.startDate} to {b.endDate}</td>
                                <td style={{ padding: '12px 8px' }}>৳{b.totalAmount || b.hourlyRate * b.totalHours}</td>
                                <td style={{ padding: '12px 8px' }}>
                                  <span className={`badge ${b.status === 'ACCEPTED' ? 'badge-verified' : 'badge-pending'}`}>
                                    {b.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* POST A JOB TAB */}
              {activeTab === 'create-job' && (
                <div className="card" style={{ padding: '32px' }}>
                  <h3 style={{ fontSize: '22px', marginBottom: '24px' }}>Post a New Childcare Job</h3>
                  <form onSubmit={handlePostJob}>
                    <div className="form-group">
                      <label className="form-label">Job Title *</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Need a Babysitter for 2 toddlers on weekends" 
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Description *</label>
                      <textarea 
                        rows="4" 
                        placeholder="Describe child details, expectations, games, meal rules etc..."
                        className="form-control"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      ></textarea>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Hourly Rate (৳ budget) *</label>
                        <input 
                          type="number" 
                          className="form-control"
                          value={hourlyRate}
                          onChange={(e) => setHourlyRate(Number(e.target.value))}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Job Location *</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Dhanmondi, Dhaka" 
                          className="form-control"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Start Date *</label>
                        <input 
                          type="date" 
                          className="form-control"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">End Date *</label>
                        <input 
                          type="date" 
                          className="form-control"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Job Type</label>
                        <select 
                          className="form-control"
                          value={jobType}
                          onChange={(e) => setJobType(e.target.value)}
                        >
                          <option value="PART_TIME">Part Time</option>
                          <option value="FULL_TIME">Full Time</option>
                          <option value="WEEKEND">Weekend</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Child Name</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Leo" 
                          className="form-control"
                          value={childName}
                          onChange={(e) => setChildName(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Child Age</label>
                        <input 
                          type="number" 
                          placeholder="e.g. 3" 
                          className="form-control"
                          value={childAge}
                          onChange={(e) => setChildAge(e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Child Gender</label>
                        <select 
                          className="form-control"
                          value={childGender}
                          onChange={(e) => setChildGender(e.target.value)}
                        >
                          <option value="MALE">Male</option>
                          <option value="FEMALE">Female</option>
                          <option value="MIXED">Mixed</option>
                        </select>
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '20px', padding: '14px' }}>
                      Publish Job Post
                    </button>
                  </form>
                </div>
              )}

              {/* MY JOB POSTS & APPLICANTS TAB */}
              {activeTab === 'my-jobs' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <h3 style={{ fontSize: '22px' }}>My Job Posts & Candidates</h3>
                  {myJobs.length === 0 ? (
                    <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--color-body)' }}>
                      You haven't posted any jobs yet.
                    </div>
                  ) : (
                    myJobs.map((job) => (
                      <div key={job._id} className="card" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-gray-border)', paddingBottom: '12px', marginBottom: '16px' }}>
                          <div>
                            <h4 style={{ fontSize: '18px' }}>{job.title}</h4>
                            <p style={{ fontSize: '12px', color: 'var(--color-body)', marginTop: '4px' }}>Location: {job.location} | Rate: ৳{job.hourlyRate}/hr</p>
                          </div>
                          <span className={`badge ${job.status === 'OPEN' ? 'badge-verified' : 'badge-danger'}`}>{job.status}</span>
                        </div>

                        {/* Applicants Section */}
                        <div>
                          <h5 style={{ fontSize: '14px', marginBottom: '10px', color: 'var(--color-body)' }}>Applicants ({job.applicants?.length || 0})</h5>
                          {!job.applicants || job.applicants.length === 0 ? (
                            <p style={{ fontSize: '13px', color: 'var(--color-body)', fontStyle: 'italic' }}>No babysitters have applied yet.</p>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                              {job.applicants.map((app, i) => {
                                const applicantSitter = app.sitter || {};
                                return (
                                  <div key={i} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    background: 'var(--color-bg-light)',
                                    padding: '12px 16px',
                                    borderRadius: '12px',
                                    border: '1px solid var(--color-gray-border)'
                                  }}>
                                    <div>
                                      <div style={{ fontWeight: '700', fontSize: '14px' }}>{applicantSitter.name || 'Babysitter Candidate'}</div>
                                      <div style={{ fontSize: '12px', color: 'var(--color-body)' }}>Applied: {new Date(app.appliedAt).toLocaleDateString()}</div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                      {app.status === 'PENDING' ? (
                                        <>
                                          <button 
                                            onClick={() => handleApplicantStatus(job._id, applicantSitter._id, 'ACCEPTED')}
                                            className="btn btn-tertiary" 
                                            style={{ padding: '6px 14px', fontSize: '11px', boxShadow: 'none' }}
                                          >
                                            <Check size={14} /> Accept
                                          </button>
                                          <button 
                                            onClick={() => handleApplicantStatus(job._id, applicantSitter._id, 'REJECTED')}
                                            className="btn btn-outline" 
                                            style={{ padding: '6px 14px', fontSize: '11px', boxShadow: 'none', border: '2px solid var(--color-dark)' }}
                                          >
                                            <X size={14} /> Reject
                                          </button>
                                        </>
                                      ) : (
                                        <span className={`badge ${app.status === 'ACCEPTED' ? 'badge-verified' : 'badge-danger'}`} style={{ fontSize: '11px' }}>
                                          {app.status}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* MY BOOKINGS TAB */}
              {activeTab === 'bookings' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <h3 style={{ fontSize: '22px' }}>Hiring History & Bookings</h3>
                  {myBookings.length === 0 ? (
                    <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--color-body)' }}>
                      No hires or bookings found.
                    </div>
                  ) : (
                    myBookings.map((b) => (
                      <div key={b._id} className="card" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-gray-border)', paddingBottom: '12px', marginBottom: '16px' }}>
                          <div>
                            <h4 style={{ fontSize: '18px' }}>Hired: {b.sitter?.name || 'Vetted Sitter'}</h4>
                            <p style={{ fontSize: '12px', color: 'var(--color-body)' }}>{b.startDate} to {b.endDate} | {b.startTime} - {b.endTime}</p>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                            <span className={`badge ${b.status === 'ACCEPTED' ? 'badge-verified' : 'badge-pending'}`}>{b.status}</span>
                            <span className={`badge ${b.paymentStatus === 'PAID' ? 'badge-verified' : 'badge-pending'}`} style={{ fontSize: '10px' }}>
                              Payment: {b.paymentStatus}
                            </span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <span style={{ fontSize: '13px', color: 'var(--color-body)' }}>Total Budget:</span>
                            <div style={{ fontSize: '20px', fontWeight: '800' }}>৳{b.totalAmount || b.hourlyRate * b.totalHours}</div>
                          </div>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            {b.status === 'ACCEPTED' && b.paymentStatus === 'PENDING' && (
                              <button 
                                onClick={() => { setSelectedBooking(b); setIsPaymentOpen(true); }}
                                className="btn btn-primary" 
                                style={{ padding: '8px 20px', fontSize: '13px', boxShadow: 'none' }}
                              >
                                Make Payment
                              </button>
                            )}

                            {/* Completed review trigger */}
                            {b.status === 'COMPLETED' && (
                              <button 
                                onClick={() => setReviewBookingId(b._id)}
                                className="btn btn-secondary" 
                                style={{ padding: '8px 20px', fontSize: '13px', boxShadow: 'none' }}
                              >
                                Give Review & Rating
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Review Form Drawer */}
                        {reviewBookingId === b._id && (
                          <div className="card" style={{ marginTop: '20px', background: 'var(--color-bg-light)', border: '2px dashed var(--color-secondary)' }}>
                            <h4 style={{ fontSize: '15px', marginBottom: '14px' }}>Submit Sitter Review</h4>
                            <form onSubmit={handleSubmitReview}>
                              <div className="form-group">
                                <label className="form-label">Rating (1 to 5 Stars)</label>
                                <select 
                                  className="form-control"
                                  value={rating}
                                  onChange={(e) => setRating(Number(e.target.value))}
                                >
                                  <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
                                  <option value="4">⭐⭐⭐⭐ 4 Stars</option>
                                  <option value="3">⭐⭐⭐ 3 Stars</option>
                                  <option value="2">⭐⭐ 2 Stars</option>
                                  <option value="1">⭐ 1 Star</option>
                                </select>
                              </div>
                              <div className="form-group">
                                <label className="form-label">Comment</label>
                                <textarea 
                                  rows="2" 
                                  placeholder="Write about child care experience, communication etc..."
                                  className="form-control"
                                  value={comment}
                                  onChange={(e) => setComment(e.target.value)}
                                ></textarea>
                              </div>
                              <div style={{ display: 'flex', gap: '10px' }}>
                                <button type="submit" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '12px', boxShadow: 'none' }}>Submit Review</button>
                                <button type="button" onClick={() => setReviewBookingId(null)} className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '12px', boxShadow: 'none', border: '2px solid var(--color-dark)' }}>Cancel</button>
                              </div>
                            </form>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* PROFILE SETTINGS TAB */}
              {activeTab === 'settings' && (
                <div className="card" style={{ padding: '32px' }}>
                  <h3 style={{ fontSize: '22px', marginBottom: '24px' }}>Parent Profile Settings</h3>
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
                      <label className="form-label">Child Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Lily" 
                        className="form-control"
                        value={parentChildName}
                        onChange={(e) => setParentChildName(e.target.value)}
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Child Age</label>
                        <input 
                          type="number" 
                          placeholder="e.g. 3" 
                          className="form-control"
                          value={parentChildAge}
                          onChange={(e) => setParentChildAge(e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Child Gender</label>
                        <select 
                          className="form-control"
                          value={parentChildGender}
                          onChange={(e) => setParentChildGender(e.target.value)}
                        >
                          <option value="MALE">Male</option>
                          <option value="FEMALE">Female</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Expected Hourly Budget (৳)</label>
                      <input 
                        type="number" 
                        className="form-control"
                        value={expectedHourlyBudget}
                        onChange={(e) => setExpectedHourlyBudget(Number(e.target.value))}
                      />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '20px', padding: '14px' }}>
                      Update Profile Information
                    </button>
                  </form>
                </div>
              )}

            </div>

          </div>

        </div>
      </main>

      {/* Stripe payment element popup */}
      <PaymentModal 
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        booking={selectedBooking}
        onSuccess={() => {
          setSuccessMsg('Booking payment completed successfully!');
          loadDashboardData();
        }}
      />

      <Footer />
    </div>
  );
}
