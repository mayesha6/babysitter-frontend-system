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

  // Tab control: 'overview', 'post-job', 'my-jobs', 'bookings', 'settings'
  const [activeTab, setActiveTab] = useState('overview');

  // Payment Modal state
  const [paymentBooking, setPaymentBooking] = useState<any>(null);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);

  // Post Job form state
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [hourlyRate, setHourlyRate] = useState<string | number>(350);
  const [jobType, setJobType] = useState('PART_TIME');

  // Settings form state
  const [parentAddress, setParentAddress] = useState('');
  const [childrenCount, setChildrenCount] = useState<number | string>(1);
  const [childrenAges, setChildrenAges] = useState('');
  const [specialNeeds, setSpecialNeeds] = useState('');

  // Candidates & Selection state
  const [selectedJobForApplicants, setSelectedJobForApplicants] = useState<any>(null);
  const [candidates, setCandidates] = useState<any[]>([]);

  // List data states
  const [myJobs, setMyJobs] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Security check: redirect if not Parent
  useEffect(() => {
    if (user && user.role !== 'PARENT') {
      router.push('/');
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;
    setLoadingData(true);
    try {
      // Fetch Parent's job posts
      const jobsRes: any = await api.get('/job-posts/my-jobs');
      setMyJobs(jobsRes.data || jobsRes || []);

      // Fetch Parent's bookings
      const bookingsRes: any = await api.get('/bookings/parent');
      setBookings(bookingsRes.data || bookingsRes || []);
    } catch (err: any) {
      console.warn('Backend API unavailable, loading mock parent state.', err.message);
      setMyJobs([
        {
          _id: 'j1',
          title: 'Weekend Babysitter needed for toddler',
          location: 'Dhanmondi, Dhaka',
          hourlyRate: 350,
          jobType: 'PART_TIME',
          applicantsCount: 2
        }
      ]);
      setBookings([
        {
          _id: 'b1',
          sitter: { name: 'Jannat ul Ferdous' },
          startDate: new Date().toISOString(),
          endDate: new Date().toISOString(),
          totalHours: 8,
          hourlyRate: 350,
          totalAmount: 2800,
          paymentStatus: 'UNPAID'
        }
      ]);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [user, activeTab]);

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle || !jobDescription || !jobLocation || !hourlyRate) {
      setErrorMsg('Please fill in all required job fields.');
      return;
    }
    setErrorMsg(null);
    try {
      await api.post('/job-posts', {
        title: jobTitle,
        description: jobDescription,
        location: jobLocation,
        hourlyRate: Number(hourlyRate),
        jobType
      });
      setSuccessMsg('Job requirement posted successfully!');
      setJobTitle('');
      setJobDescription('');
      setJobLocation('');
      setActiveTab('my-jobs');
    } catch (err: any) {
      setErrorMsg(err.message || 'Job creation failed.');
    }
  };

  const handleViewApplicants = async (jobId: string) => {
    setSelectedJobForApplicants(jobId);
    try {
      const res: any = await api.get(`/applications/job/${jobId}`);
      setCandidates(res.data || []);
    } catch (err: any) {
      console.warn('Applicants API unavailable, showing mock applicants.', err.message);
      setCandidates([
        {
          _id: 'app1',
          sitter: { _id: 'sitter1', name: 'Jannat ul Ferdous' },
          coverLetter: 'Hello! Experienced in toddler care with CPR certification.'
        }
      ]);
    }
  };

  const handleHireCandidate = async (applicant: any) => {
    try {
      await api.post('/bookings', {
        sitter: applicant.sitter?._id || applicant.sitter,
        jobPost: selectedJobForApplicants,
        hourlyRate: Number(hourlyRate || 350),
        totalHours: 8,
        startDate: new Date(),
        endDate: new Date()
      });
      setSuccessMsg(`Hiring request sent to ${applicant.sitter?.name || 'Babysitter'}!`);
      loadDashboardData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Hiring request failed.');
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.patch(`/parent-profile/${user?._id}`, {
        address: parentAddress,
        childrenCount: Number(childrenCount),
        childrenAges,
        specialNeeds
      });
      await fetchSubProfile(user);
      setSuccessMsg('Family profile settings saved successfully!');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save settings.');
    }
  };

  if (!user) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <div className="container flex-center" style={{ flex: 1, flexDirection: 'column', gap: '16px' }}>
          <ShieldAlert size={48} color="var(--color-danger)" />
          <h3 style={{ fontWeight: '600' }}>Parent Log In Required</h3>
          <p>Please log in as a Parent to access this dashboard.</p>
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
            <ParentSidebarNav 
              user={user}
              profile={profile}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />

            {/* Main Content Area */}
            <div>
              {/* Messages */}
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
                <ParentOverviewTab 
                  user={user}
                  profile={profile}
                  myJobs={myJobs}
                  bookings={bookings}
                  setActiveTab={setActiveTab}
                />
              )}

              {/* POST A JOB */}
              {activeTab === 'post-job' && (
                <ParentPostJobTab 
                  jobTitle={jobTitle} setJobTitle={setJobTitle}
                  jobDescription={jobDescription} setJobDescription={setJobDescription}
                  jobLocation={jobLocation} setJobLocation={setJobLocation}
                  hourlyRate={hourlyRate} setHourlyRate={setHourlyRate}
                  jobType={jobType} setJobType={setJobType}
                  handleCreateJob={handleCreateJob}
                />
              )}

              {/* MY JOBS & CANDIDATES */}
              {activeTab === 'my-jobs' && (
                <ParentJobsCandidateTab 
                  myJobs={myJobs}
                  candidates={candidates}
                  selectedJobForApplicants={selectedJobForApplicants}
                  handleViewApplicants={handleViewApplicants}
                  handleHireCandidate={handleHireCandidate}
                />
              )}

              {/* BOOKINGS */}
              {activeTab === 'bookings' && (
                <ParentBookingsTab 
                  bookings={bookings}
                  setPaymentBooking={setPaymentBooking}
                  setShowPaymentModal={setShowPaymentModal}
                />
              )}

              {/* SETTINGS */}
              {activeTab === 'settings' && (
                <ParentSettingsTab 
                  parentAddress={parentAddress} setParentAddress={setParentAddress}
                  childrenCount={childrenCount} setChildrenCount={setChildrenCount}
                  childrenAges={childrenAges} setChildrenAges={setChildrenAges}
                  specialNeeds={specialNeeds} setSpecialNeeds={setSpecialNeeds}
                  handleSaveProfile={handleSaveProfile}
                />
              )}

            </div>

          </div>
        </div>
      </main>

      <PaymentModal 
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        booking={paymentBooking}
        onSuccess={() => {
          setSuccessMsg('Payment processed successfully!');
          loadDashboardData();
        }}
      />

      <Footer />
    </div>
  );
}
