'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import PaymentModal from '../../components/PaymentModal';
import ParentSidebarNav from '../../components/parent/ParentSidebarNav';
import ParentOverviewTab from '../../components/parent/ParentOverviewTab';
import ParentPostJobTab from '../../components/parent/ParentPostJobTab';
import ParentJobsCandidateTab from '../../components/parent/ParentJobsCandidateTab';
import ParentBookingsTab from '../../components/parent/ParentBookingsTab';
import ParentSettingsTab from '../../components/parent/ParentSettingsTab';
import { useApp } from '../../context/AppContext';
import api from '../../services/api';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function ParentDashboard() {
  const { user, profile, fetchSubProfile } = useApp();
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
      const parentJobs = (jobsRes.data || []).filter(j => j.parent === user._id || j.parent?._id === user._id);
      setMyJobs(parentJobs);

      // 2. Fetch parent's bookings
      const bookingsRes = await api.get('/bookings');
      setMyBookings(bookingsRes.data || []);
    } catch (err) {
      console.warn('Backend tables unavailable, loading mock dashboard state.', err.message);
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
        <div className="container flex-center" style={{ flex: 1, flexDirection: 'column', gap: '16px', padding: '80px 0' }}>
          <ShieldAlert size={48} color="var(--color-danger)" />
          <h3>Parent Log In Required</h3>
          <p style={{ color: 'var(--color-body)' }}>Please log in as a Parent to view this dashboard.</p>
          <button onClick={() => router.push('/auth')} className="btn btn-primary" style={{ padding: '12px 28px' }}>Log In</button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />

      <main style={{ flex: 1, background: 'var(--color-bg-light)', padding: '30px 0 60px 0' }}>
        <div className="container">
          
          <div className="dashboard-layout">
            
            {/* Sidebar Navigation */}
            <ParentSidebarNav 
              user={user}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onClearMessages={() => { setErrorMsg(null); setSuccessMsg(null); }}
            />

            {/* Main Dashboard Workspace */}
            <div>
              {/* Alert Feedback Messages */}
              {errorMsg && (
                <div style={{ background: 'rgba(255, 110, 110, 0.1)', border: '1px solid var(--color-danger)', color: 'var(--color-danger)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', fontSize: '14px', marginBottom: '20px' }}>
                  {errorMsg}
                </div>
              )}
              {successMsg && (
                <div style={{ background: 'rgba(76, 217, 100, 0.12)', border: '1px solid var(--color-success)', color: 'var(--color-success)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', fontSize: '14px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={18} />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* OVERVIEW TAB */}
              {activeTab === 'overview' && (
                <ParentOverviewTab 
                  myJobs={myJobs}
                  myBookings={myBookings}
                  setActiveTab={setActiveTab}
                />
              )}

              {/* POST A JOB TAB */}
              {activeTab === 'create-job' && (
                <ParentPostJobTab 
                  title={title} setTitle={setTitle}
                  description={description} setDescription={setDescription}
                  hourlyRate={hourlyRate} setHourlyRate={setHourlyRate}
                  location={location} setLocation={setLocation}
                  startDate={startDate} setStartDate={setStartDate}
                  endDate={endDate} setEndDate={setEndDate}
                  startTime={startTime} setStartTime={setStartTime}
                  endTime={endTime} setEndTime={setEndTime}
                  jobType={jobType} setJobType={setJobType}
                  childName={childName} setChildName={setChildName}
                  childAge={childAge} setChildAge={setChildAge}
                  childGender={childGender} setChildGender={setChildGender}
                  handlePostJob={handlePostJob}
                />
              )}

              {/* MY JOB POSTS & APPLICANTS TAB */}
              {activeTab === 'my-jobs' && (
                <ParentJobsCandidateTab 
                  myJobs={myJobs}
                  handleApplicantStatus={handleApplicantStatus}
                />
              )}

              {/* MY BOOKINGS & INVOICES TAB */}
              {activeTab === 'bookings' && (
                <ParentBookingsTab 
                  myBookings={myBookings}
                  setSelectedBooking={setSelectedBooking}
                  setIsPaymentOpen={setIsPaymentOpen}
                  reviewBookingId={reviewBookingId}
                  setReviewBookingId={setReviewBookingId}
                  rating={rating}
                  setRating={setRating}
                  comment={comment}
                  setComment={setComment}
                  handleSubmitReview={handleSubmitReview}
                />
              )}

              {/* PROFILE SETTINGS TAB */}
              {activeTab === 'settings' && (
                <ParentSettingsTab 
                  address={address} setAddress={setAddress}
                  parentChildName={parentChildName} setParentChildName={setParentChildName}
                  parentChildAge={parentChildAge} setParentChildAge={setParentChildAge}
                  parentChildGender={parentChildGender} setParentChildGender={setParentChildGender}
                  expectedHourlyBudget={expectedHourlyBudget} setExpectedHourlyBudget={setExpectedHourlyBudget}
                  handleUpdateProfile={handleUpdateProfile}
                />
              )}

            </div>

          </div>

        </div>
      </main>

      {/* Stripe payment modal */}
      <PaymentModal 
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        booking={selectedBooking}
        onSuccess={() => {
          setSuccessMsg('Booking invoice paid successfully via Stripe!');
          loadDashboardData();
        }}
      />

      <Footer />
    </div>
  );
}
