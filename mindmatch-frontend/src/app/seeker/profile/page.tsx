"use client";
import React, { useEffect, useState } from 'react';
import SeekerNavBar from '@/components/SeekerNavBar';
import { useSeekerState, useSeekerActions } from '@/providers/seeker';
import { useAuthState } from '@/providers/authProvider';
import { useRouter } from 'next/navigation';
import profileStyles from './profilestyles';
import { ISeeker } from '@/providers/seeker/types';

export default function ProfilePage() {
  const { profile, isPending, isError, error } = useSeekerState();
  const { getProfile, updateProfile } = useSeekerActions();
  const { user } = useAuthState();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<ISeeker>>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState<'success' | 'error'>('success');
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    if (!user?.token) {
      router.push('/auth/login');
      return;
    }
    getProfile();
    
    // Check server status
    const checkServerStatus = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/services/app/Session/GetCurrentLoginInformations`);
        if (response.ok) {
          setServerStatus('online');
        } else {
          setServerStatus('offline');
        }
      } catch {
        setServerStatus('offline');
      }
    };
    
    checkServerStatus();
  }, [user, getProfile, router]);

  useEffect(() => {
    if (profile) {
      setEditData({
        name: profile.name,
        surname: profile.surname,
        email: profile.email,
        displayName: profile.displayName,
        emergencyContactName: profile.emergencyContactName,
        emergencyContactPhone: profile.emergencyContactPhone,
      });
    }
  }, [profile]);

  const handleInputChange = (field: keyof ISeeker, value: string) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      await updateProfile(editData);
      setIsEditing(false);
      setFeedbackMessage('Profile updated successfully!');
      setFeedbackType('success');
      setShowFeedback(true);
      setTimeout(() => setShowFeedback(false), 3000);
    } catch (error: any) {
      console.error('Profile update error:', error);
      
      let errorMessage = 'Failed to update profile. Please try again.';
      
      if (error?.response?.status === 500) {
        errorMessage = 'Server is temporarily unavailable. Please try again in a few minutes.';
      } else if (error?.response?.status === 401) {
        errorMessage = 'Your session has expired. Please log in again.';
        setTimeout(() => router.push('/auth/login'), 2000);
      } else if (error?.response?.status === 403) {
        errorMessage = 'You do not have permission to update this profile.';
      } else if (error?.response?.data?.error?.message) {
        errorMessage = error.response.data.error.message;
      } else if (error?.message) {
        errorMessage = `Network error: ${error.message}`;
      }
      
      setFeedbackMessage(errorMessage);
      setFeedbackType('error');
      setShowFeedback(true);
      setTimeout(() => setShowFeedback(false), 5000); // Show error messages longer
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (profile) {
      setEditData({
        name: profile.name,
        surname: profile.surname,
        email: profile.email,
        displayName: profile.displayName,
        emergencyContactName: profile.emergencyContactName,
        emergencyContactPhone: profile.emergencyContactPhone,
      });
    }
  };

  const getInitials = (name: string, surname: string) => {
    return `${name?.charAt(0) || ''}${surname?.charAt(0) || ''}`.toUpperCase();
  };

  if (isPending) {
    return (
      <>
        <SeekerNavBar />
        <div style={profileStyles.loading}>
          <span style={{ marginRight: 12 }}>⏳</span>
          {' '}Loading your profile...
        </div>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <SeekerNavBar />
        <div style={profileStyles.error}>
          <span style={{ marginRight: 8 }}>❌</span>
          {' '}{error || 'Failed to load profile'}
        </div>
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <SeekerNavBar />
        <div style={profileStyles.error}>
          <span style={{ marginRight: 8 }}>⚠️</span>
          {' '}Profile data not available
        </div>
      </>
    );
  }

  return (
    <>
      <SeekerNavBar />
      <div style={profileStyles.container}>
        {showFeedback && (
          <div style={{
            position: 'fixed',
            top: 80,
            left: '50%',
            transform: 'translateX(-50%)',
            background: feedbackType === 'error' ? '#fee2e2' : '#d1fae5',
            color: feedbackType === 'error' ? '#991b1b' : '#065f46',
            padding: '16px 24px',
            borderRadius: 12,
            fontWeight: 600,
            fontSize: 16,
            boxShadow: '0 4px 24px rgba(99,102,241,0.10)',
            zIndex: 1000,
            transition: 'all 0.3s',
          }}>
            {feedbackMessage}
          </div>
        )}
        
        <div style={profileStyles.orbTop} />
        <div style={profileStyles.orbBottom} />
        
        <main style={profileStyles.main}>
          <div style={profileStyles.card}>
            <h1 style={profileStyles.heading}>My Profile</h1>
            <div style={profileStyles.subheading}>
              Manage your personal information and emergency contacts
            </div>
            
            {/* Server Status Indicator */}
            {serverStatus !== 'checking' && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '8px 16px',
                borderRadius: 8,
                background: serverStatus === 'online' ? '#d1fae5' : '#fee2e2',
                color: serverStatus === 'online' ? '#065f46' : '#991b1b',
                fontSize: 14,
                fontWeight: 500,
                marginBottom: 16,
              }}>
                <span>{serverStatus === 'online' ? '🟢' : '🔴'}</span>
                {' '}Server Status: {serverStatus === 'online' ? 'Online' : 'Offline - Some features may not work'}
              </div>
            )}

            {/* Avatar Section */}
            <div style={profileStyles.avatarSection}>
              <div style={profileStyles.avatar}>
                {getInitials(profile.name, profile.surname)}
              </div>
              <div style={profileStyles.displayName}>
                {profile.displayName || `${profile.name} ${profile.surname}`}
              </div>
              <div style={profileStyles.email}>{profile.email}</div>
            </div>

            {/* Personal Information Section */}
            <div style={profileStyles.profileSection}>
              <div style={profileStyles.sectionTitle}>
                <span>👤</span>
                {' '}Personal Information
              </div>
              
              <div style={profileStyles.profileGrid}>
                <div style={profileStyles.formGroup}>
                  <label htmlFor="firstName" style={profileStyles.fieldLabel}>First Name</label>
                  {isEditing ? (
                    <input
                      id="firstName"
                      type="text"
                      value={editData.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      style={profileStyles.formInput}
                    />
                  ) : (
                    <div style={profileStyles.fieldValue}>{profile.name}</div>
                  )}
                </div>

                <div style={profileStyles.formGroup}>
                  <label htmlFor="lastName" style={profileStyles.fieldLabel}>Last Name</label>
                  {isEditing ? (
                    <input
                      id="lastName"
                      type="text"
                      value={editData.surname || ''}
                      onChange={(e) => handleInputChange('surname', e.target.value)}
                      style={profileStyles.formInput}
                    />
                  ) : (
                    <div style={profileStyles.fieldValue}>{profile.surname}</div>
                  )}
                </div>

                <div style={profileStyles.formGroup}>
                  <label htmlFor="email" style={profileStyles.fieldLabel}>Email Address</label>
                  {isEditing ? (
                    <input
                      id="email"
                      type="email"
                      value={editData.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      style={profileStyles.formInput}
                    />
                  ) : (
                    <div style={profileStyles.fieldValue}>{profile.email}</div>
                  )}
                </div>

                <div style={profileStyles.formGroup}>
                  <label htmlFor="displayName" style={profileStyles.fieldLabel}>Display Name</label>
                  {isEditing ? (
                    <input
                      id="displayName"
                      type="text"
                      value={editData.displayName || ''}
                      onChange={(e) => handleInputChange('displayName', e.target.value)}
                      style={profileStyles.formInput}
                      placeholder="How you'd like to be addressed"
                    />
                  ) : (
                    <div style={profileStyles.fieldValue}>
                      {profile.displayName || <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>Not set</span>}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Emergency Contact Section */}
            <div style={profileStyles.emergencySection}>
              <div style={profileStyles.emergencyTitle}>
                <span>🚨</span>
                {' '}Emergency Contact
              </div>
              
              <div style={profileStyles.emergencyGrid}>
                <div style={profileStyles.formGroup}>
                  <label htmlFor="emergencyName" style={profileStyles.fieldLabel}>Contact Name</label>
                  {isEditing ? (
                    <input
                      id="emergencyName"
                      type="text"
                      value={editData.emergencyContactName || ''}
                      onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                      style={profileStyles.formInput}
                      placeholder="Emergency contact's full name"
                    />
                  ) : (
                    <div style={profileStyles.fieldValue}>
                      {profile.emergencyContactName || <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>Not set</span>}
                    </div>
                  )}
                </div>

                <div style={profileStyles.formGroup}>
                  <label htmlFor="emergencyPhone" style={profileStyles.fieldLabel}>Contact Phone</label>
                  {isEditing ? (
                    <input
                      id="emergencyPhone"
                      type="tel"
                      value={editData.emergencyContactPhone || ''}
                      onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
                      style={profileStyles.formInput}
                      placeholder="Emergency contact's phone number"
                    />
                  ) : (
                    <div style={profileStyles.fieldValue}>
                      {profile.emergencyContactPhone || <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>Not set</span>}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={profileStyles.buttonGroup}>
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    style={profileStyles.buttonPrimary}
                    onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                    onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                    onFocus={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                    onBlur={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                  >
                    <span>💾</span>
                    {' '}Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    style={profileStyles.buttonSecondary}
                    onMouseOver={(e) => (e.currentTarget.style.background = '#f3f4f6')}
                    onMouseOut={(e) => (e.currentTarget.style.background = 'white')}
                    onFocus={(e) => (e.currentTarget.style.background = '#f3f4f6')}
                    onBlur={(e) => (e.currentTarget.style.background = 'white')}
                  >
                    <span>❌</span>
                    {' '}Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  style={profileStyles.buttonPrimary}
                  onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                  onFocus={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onBlur={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  <span>✏️</span>
                  {' '}Edit Profile
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
