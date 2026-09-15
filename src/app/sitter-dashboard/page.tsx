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
      // 1. Fetch available parent jobs
      const jobsRes: any = await api.get('/job-posts/feed');
      setAvailableJobs(jobsRes.data || jobsRes || []);

      // 2. Fetch sitter's submitted applications
      const appsRes: any = await api.get('/applications/my-applications');
      setApplications(appsRes.data || appsRes || []);

      // 3. Fetch sitter's bookings & schedule
      const bookingsRes: any = await api.get('/bookings/sitter');
      setBookings(bookingsRes.data || bookingsRes || []);
    } catch (err: any) {
      console.warn('Backend API unavailable, loading mock sitter state.', err.message);
      setAvailableJobs([
        {
          _id: 'j1',
          title: 'Weekend Babysitter needed for toddler',
          location: 'Dhanmondi, Dhaka',
          hourlyRate: 350,
          jobType: 'PART_TIME',
          description: 'Looking for a CPR-certified sitter for 8 hours on Saturday.'
        }
      ]);
      setApplications([
        {
          _id: 'app1',
          jobPost: { title: 'Weekend Babysitter needed for toddler' },
          status: 'PENDING',
          createdAt: new Date().toISOString()
        }
      ]);
      setBookings([
        {
          _id: 'b1',
          parent: { name: 'Rahat Hossain' },
          startDate: new Date().toISOString(),
          endDate: new Date().toISOString(),
          totalHours: 8,
          hourlyRate: 350,
          totalAmount: 2800,
          status: 'ACCEPTED'
        }
      ]);
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
      await api.post('/applications', {
        jobPostId: selectedJobForApply._id,
        coverLetter
      });
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
      await api.patch(`/bookings/${bookingId}/status`, { status });
      setSuccessMsg(`Booking request status updated to ${status}!`);
      loadDashboardData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Booking update failed.');
    }
  };

  const handleUploadDocuments = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/sitter-profile/verify-documents', {
        nidNumber,
        nidFrontImage,
        nidBackImage,
        selfieImage,
        policeClearanceImage
      });
      await fetchSubProfile(user);
      setSuccessMsg('Verification documents submitted successfully for admin audit!');
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
