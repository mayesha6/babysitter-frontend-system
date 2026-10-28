'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SitterSidebarNav from '../../components/sitter/SitterSidebarNav';
import SitterOverviewTab from '../../components/sitter/SitterOverviewTab';
import SitterJobsFeedTab from '../../components/sitter/SitterJobsFeedTab';
import SitterApplicationsTab from '../../components/sitter/SitterApplicationsTab';
import SitterScheduleTab from '../../components/sitter/SitterScheduleTab';
import SitterEarningsTab from '../../components/sitter/SitterEarningsTab';
import SitterProfileUploadsTab from '../../components/sitter/SitterProfileUploadsTab';
import { useApp } from '../../context/AppContext';
import api from '../../services/api';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function SitterDashboard() {
  const { user, profile, fetchSubProfile } = useApp();
  const router = useRouter();

  // Tab control: 'overview', 'jobs', 'applications', 'schedule', 'earnings', 'uploads'
  const [activeTab, setActiveTab] = useState('overview');

  // Available parent jobs feed
  const [availableJobs, setAvailableJobs] = useState<any[]>([]);
  const [selectedJobForApply, setSelectedJobForApply] = useState<any>(null);
  const [coverLetter, setCoverLetter] = useState('');

  // Upload document form states
  const [nidNumber, setNidNumber] = useState('');
  const [nidFrontImage, setNidFrontImage] = useState('');
  const [nidBackImage, setNidBackImage] = useState('');
  const [selfieImage, setSelfieImage] = useState('');
  const [policeClearanceImage, setPoliceClearanceImage] = useState('');

  // Data states
  const [applications, setApplications] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Security check: redirect if not Babysitter
  useEffect(() => {
    if (user && user.role !== 'BABYSITTER') {
      router.push('/');
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;
    setLoadingData(true);
    try {
      // 1. Fetch available parent jobs from /job-post
      const jobsRes: any = await api.get('/job-post');
      const allJobs = Array.isArray(jobsRes.data) ? jobsRes.data : Array.isArray(jobsRes) ? jobsRes : [];
      
      // Filter open jobs
      const openJobs = allJobs.filter((j: any) => j.status === 'OPEN' || !j.status);
      setAvailableJobs(openJobs);

      // 2. Derive sitter's submitted applications from job posts
      const myApplications = allJobs
        .filter((job: any) => Array.isArray(job.applicants) && job.applicants.some((a: any) => (a.sitter?._id || a.sitter) === user._id))
        .map((job: any) => {
          const applicantInfo = job.applicants.find((a: any) => (a.sitter?._id || a.sitter) === user._id);
          return {
            _id: applicantInfo?._id || job._id,
            jobPost: job,
            status: applicantInfo?.status || 'PENDING',
            createdAt: applicantInfo?.appliedAt || job.createdAt || new Date().toISOString()
          };
        });
      setApplications(myApplications);

      // 3. Fetch sitter's bookings from /bookings (backend automatically filters by sitter role)
      const bookingsRes: any = await api.get('/bookings');
      const allBookings = Array.isArray(bookingsRes.data) ? bookingsRes.data : Array.isArray(bookingsRes) ? bookingsRes : [];
      setBookings(allBookings);
    } catch (err: any) {
      console.warn('Backend API notice, keeping active state:', err.message);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [user, activeTab]);

  const handleApplyForJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobForApply) return;
    try {
      // Backend apply endpoint: POST /job-post/:id/apply
      await api.post(`/job-post/${selectedJobForApply._id}/apply`);
      setSuccessMsg('Job application submitted successfully!');
      setSelectedJobForApply(null);
      setCoverLetter('');
      loadDashboardData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Application submission failed.');
    }
  };

  const handleBookingAction = async (bookingId: string, status: string) => {
    try {
      // Map UI REJECTED to backend BookingStatus CANCELLED
      const backendStatus = status === 'REJECTED' ? 'CANCELLED' : status;
      await api.patch(`/bookings/${bookingId}/status`, { status: backendStatus });
      setSuccessMsg(`Booking status updated to ${status}!`);
      loadDashboardData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Booking update failed.');
    }
  };

  const handleUploadDocuments = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Backend sitter profile update endpoint: PATCH /sitter-profile/:userId
      await api.patch(`/sitter-profile/${user._id}`, {
        nidNumber,
        nidFrontImage,
        nidBackImage,
        selfieImage,
        policeClearanceImage
      });
      await fetchSubProfile(user);
      setSuccessMsg('Verification documents submitted successfully for admin review!');
    } catch (err: any) {
      setErrorMsg(err.message || 'Document upload submission failed.');
    }
  };

  if (!user) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <div className="container flex-center" style={{ flex: 1, flexDirection: 'column', gap: '16px' }}>
          <ShieldAlert size={48} color="var(--color-danger)" />
          <h3 style={{ fontWeight: '600' }}>Babysitter Log In Required</h3>
          <p>Please log in as a Babysitter to view this dashboard.</p>
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
            
            {/* Sidebar Navigation */}
            <SitterSidebarNav 
              user={user}
              profile={profile}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />

            {/* Dashboard Content */}
            <div>
              {/* Alert Feedback Messages */}
              {errorMsg && (
                <div style={{ background: 'rgba(255, 110, 110, 0.1)', border: '1px solid var(--color-danger)', color: 'var(--color-danger)', padding: '12px', borderRadius: '8px', fontSize: '13px', marginBottom: '20px' }}>
                  {errorMsg}
                </div>
              )}
              {successMsg && (
                <div style={{ background: 'rgba(76, 217, 100, 0.1)', border: '1px solid var(--color-success)', color: 'var(--color-success)', padding: '12px', borderRadius: '8px', fontSize: '13px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={16} />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* OVERVIEW */}
              {activeTab === 'overview' && (
                <SitterOverviewTab 
                  user={user}
                  profile={profile}
                  applications={applications}
                  bookings={bookings}
                  setActiveTab={setActiveTab}
                />
              )}

              {/* AVAILABLE JOBS */}
              {activeTab === 'jobs' && (
                <SitterJobsFeedTab 
                  availableJobs={availableJobs}
                  selectedJobForApply={selectedJobForApply}
                  setSelectedJobForApply={setSelectedJobForApply}
                  coverLetter={coverLetter}
                  setCoverLetter={setCoverLetter}
                  handleApplyForJob={handleApplyForJob}
                />
              )}

              {/* APPLICATIONS */}
              {activeTab === 'applications' && (
                <SitterApplicationsTab applications={applications} />
              )}

              {/* SCHEDULE */}
              {activeTab === 'schedule' && (
                <SitterScheduleTab 
                  bookings={bookings}
                  handleBookingAction={handleBookingAction}
                />
              )}

              {/* EARNINGS */}
              {activeTab === 'earnings' && (
                <SitterEarningsTab bookings={bookings} />
              )}

              {/* UPLOADS */}
              {activeTab === 'uploads' && (
                <SitterProfileUploadsTab 
                  nidNumber={nidNumber} setNidNumber={setNidNumber}
                  nidFrontImage={nidFrontImage} setNidFrontImage={setNidFrontImage}
                  nidBackImage={nidBackImage} setNidBackImage={setNidBackImage}
                  selfieImage={selfieImage} setSelfieImage={setSelfieImage}
                  policeClearanceImage={policeClearanceImage} setPoliceClearanceImage={setPoliceClearanceImage}
                  handleUploadDocuments={handleUploadDocuments}
                />
              )}

            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
