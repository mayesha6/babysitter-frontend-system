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
  const [uploadingFile, setUploadingFile] = useState(null);
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

  // Handle mock/real file uploads calling the backend /upload API
  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingFile(fieldName);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append('files', file);

    try {
      const response = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
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

  if (!user) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <div className="container flex-center" style={{ flex: 1, flexDirection: 'column', gap: '16px', padding: '80px 0' }}>
          <ShieldAlert size={48} color="var(--color-danger)" />
          <h3>Babysitter Log In Required</h3>
          <p style={{ color: 'var(--color-body)' }}>Please log in as a Babysitter to view this dashboard.</p>
          <button onClick={() => router.push('/auth')} className="btn btn-primary" style={{ padding: '12px 28px' }}>Log In</button>
        </div>
        <Footer />
      </div>
    );
  }

  const verStatus = profile?.verificationStatus || 'PENDING';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />

      <main style={{ flex: 1, background: 'var(--color-bg-light)', padding: '30px 0 60px 0' }}>
        <div className="container">
          
          <div className="dashboard-layout">
            
            {/* Sidebar Navigation */}
            <SitterSidebarNav 
              user={user}
              profile={profile}
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
                <SitterOverviewTab 
                  myBookings={myBookings}
                  earningsHistory={earningsHistory}
                  verStatus={verStatus}
                  setActiveTab={setActiveTab}
                />
              )}

              {/* BROWSE JOBS FEED TAB */}
              {activeTab === 'jobs-feed' && (
                <SitterJobsFeedTab 
                  availableJobs={availableJobs}
                  verStatus={verStatus}
                  handleApply={handleApply}
                />
              )}

              {/* MY APPLICATIONS TAB */}
              {activeTab === 'my-applications' && (
                <SitterApplicationsTab 
                  myApplications={myApplications}
                />
              )}

              {/* BOOKING REQUESTS SCHEDULE TAB */}
              {activeTab === 'schedule' && (
                <SitterScheduleTab 
                  myBookings={myBookings}
                  handleUpdateBookingStatus={handleUpdateBookingStatus}
                />
              )}

              {/* PAYMENTS HISTORY TAB */}
              {activeTab === 'earnings' && (
                <SitterEarningsTab 
                  earningsHistory={earningsHistory}
                />
              )}

              {/* SITTER PROFILE SETUP / UPLOADS TAB */}
              {activeTab === 'profile' && (
                <SitterProfileUploadsTab 
                  address={address} setAddress={setAddress}
                  about={about} setAbout={setAbout}
                  experienceYears={experienceYears} setExperienceYears={setExperienceYears}
                  hourlyRate={hourlyRate} setHourlyRate={setHourlyRate}
                  gender={gender} setGender={setGender}
                  skillsText={skillsText} setSkillsText={setSkillsText}
                  languagesText={languagesText} setLanguagesText={setLanguagesText}
                  nidNumber={nidNumber} setNidNumber={setNidNumber}
                  nidFrontImage={nidFrontImage}
                  nidBackImage={nidBackImage}
                  selfieImage={selfieImage}
                  policeClearanceImage={policeClearanceImage}
                  handleFileUpload={handleFileUpload}
                  uploadingFile={uploadingFile}
                  handleUpdateProfile={handleUpdateProfile}
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
