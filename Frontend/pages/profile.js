import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Camera, User, Mail, Phone, MapPin, Calendar, Briefcase } from 'lucide-react';
import { toast } from 'react-toastify';
import Sidebar from '../components/Sidebar';
import { getCurrentUser, removeUser } from '../services/authService';
import apiClient from '../services/api';
import styles from '../styles/Profile.module.css';

export default function Profile() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('profile');
  
  // Profile state
  const [profileData, setProfileData] = useState({
    id: null,
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    dateOfBirth: '',
    occupation: '',
    bio: '',
    profileImage: null
  });

  const [originalData, setOriginalData] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isNewProfile, setIsNewProfile] = useState(false);

  // API Base URL
  const API_URL = '/user_profile';

  // Fetch user profile on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    const user = getCurrentUser();
    
    if (!user || !user.id) {
      toast.error('User not found. Please login again.');
      router.push('/login');
      return;
    }

    try {
      setIsLoading(true);
      const response = await apiClient.get(`${API_URL}/${user.id}`);
      if (response.data && (response.data.firstName || response.data.email)) {
        const userData = response.data;
        const profileInfo = {
          id: userData.id || null,
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || user.email || '',
          phoneNumber: userData.phoneNumber || '',
          address: userData.address || '',
          dateOfBirth: userData.dateOfBirth || '',
          occupation: userData.occupation || '',
          bio: userData.bio || '',
          profileImage: userData.profileImage || null
        };
        
        if (userData.profileImage) {
          setPreviewImage(userData.profileImage);
        }
        
        setProfileData(profileInfo);
        setOriginalData(profileInfo);
        setIsNewProfile(false);
      } else {
        // No profile found
        const profileInfo = {
          id: null,
          firstName: '',
          lastName: '',
          email: user.email || '',
          phoneNumber: '',
          address: '',
          dateOfBirth: '',
          occupation: '',
          bio: '',
          profileImage: null
        };
        setProfileData(profileInfo);
        setOriginalData(profileInfo);
        setIsNewProfile(true);
        setIsEditing(true);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      
      const user = getCurrentUser();
      if (err.response?.status === 404 || err.response?.status === 500) {
        const profileInfo = {
          firstName: '',
          lastName: '',
          email: user.email || '',
          phoneNumber: '',
          address: '',
          dateOfBirth: '',
          occupation: '',
          bio: '',
          profileImage: null
        };
        setProfileData(profileInfo);
        setOriginalData(profileInfo);
        setIsNewProfile(true);
        setIsEditing(true);
        toast.info('Please complete your profile');
      } else {
        toast.error('Failed to load profile data');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    removeUser();
    toast.success('Logged out successfully!');
    router.push('/login');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setProfileData(prev => ({
          ...prev,
          profileImage: file
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = getCurrentUser();

    if (!profileData.firstName || !profileData.lastName || !profileData.email) {
      toast.error('Please fill in all required fields (First Name, Last Name, Email)');
      return;
    }

    try {
      setIsSaving(true);
      
      const profilePayload = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        phoneNumber: profileData.phoneNumber || null,
        address: profileData.address || '',
        dateOfBirth: profileData.dateOfBirth || '',
        occupation: profileData.occupation || '',
        bio: profileData.bio || '',
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      };

      if (isNewProfile) {
        await apiClient.post(`${API_URL}`, profilePayload);
        setIsNewProfile(false);
        toast.success('Profile created successfully!');
      } else {
        const updatePayload = {
          ...profilePayload,
          id: profileData.id
        };
        await apiClient.put(`${API_URL}`, updatePayload);
        toast.success('Profile updated successfully!');
      }
      
      setOriginalData(profileData);
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving profile:', err);
      const errorMessage = err.response?.data?.message || 'Failed to save profile';
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (isNewProfile) {
      setProfileData(originalData);
    } else {
      setProfileData(originalData);
      setIsEditing(false);
    }
  };

  const getInitials = () => {
    const first = profileData.firstName?.charAt(0)?.toUpperCase() || 'U';
    const last = profileData.lastName?.charAt(0)?.toUpperCase() || 'N';
    return `${first}${last}`;
  };

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar 
        isOpen={isSidebarOpen}
        activePage={activePage}
        onLogout={handleLogout}
      />

      <main className={`${styles.main} ${!isSidebarOpen ? styles.mainExpanded : ''}`}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={styles.menuBtn}
            >
              <div className={styles.hamburgerIcon}>  
                <span></span>
                <span></span>
                <span></span>
              </div>  
            </button>
            <h1 className={styles.pageTitle}>Profile</h1>
          </div>
        </header>

        {/* Profile Container */}
        <div className={styles.profileContainer}>
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.spinner}></div>
              <p>Loading profile...</p>
            </div>
          ) : (
          <div className={styles.profileCard}>
            {/* Profile Header Section */}
            <div className={styles.profileHeaderSection}>
              <div className={styles.profileImageContainer}>
                <div className={styles.profileImageWrapper}>
                  {previewImage ? (
                    <img src={previewImage} alt="Profile" className={styles.profileImage} />
                  ) : (
                    <div className={styles.profileImagePlaceholder}>
                      <span className={styles.profileInitials}>{getInitials()}</span>
                    </div>
                  )}
                  {isEditing && (
                    <label htmlFor="profile-image-input" className={styles.profileImageUpload}>
                      <Camera size={20} />
                      <input
                        type="file"
                        id="profile-image-input"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                      />
                    </label>
                  )}
                </div>
                <div className={styles.profileHeaderInfo}>
                  <h2 className={styles.profileName}>
                    {profileData.firstName || profileData.lastName 
                      ? `${profileData.firstName} ${profileData.lastName}` 
                      : 'Your Name'}
                  </h2>
                  <p className={styles.profileOccupation}>{profileData.occupation || 'Your Occupation'}</p>
                </div>
              </div>
              
              {!isEditing && (
                <button 
                  className={styles.editProfileBtn}
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              )}
            </div>

            {/* Profile Form */}
            <form className={styles.profileForm} onSubmit={handleSubmit}>
              {/* Bio Section */}
              <div className={styles.profileSection}>
                <h3 className={styles.sectionTitle}>About</h3>
                <div className={styles.profileFormGroup}>
                  <label htmlFor="bio" className={styles.profileFormLabel}>
                    <Briefcase size={18} />
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={profileData.bio}
                    onChange={handleInputChange}
                    className={styles.profileFormTextarea}
                    placeholder="Tell us about yourself..."
                    rows="3"
                    disabled={!isEditing}
                  />
                </div>
              </div>

              {/* Personal Information Section */}
              <div className={styles.profileSection}>
                <h3 className={styles.sectionTitle}>Personal Information</h3>
                
                <div className={styles.profileFormRow}>
                  <div className={styles.profileFormGroup}>
                    <label htmlFor="firstName" className={styles.profileFormLabel}>
                      <User size={18} />
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleInputChange}
                      className={styles.profileFormInput}
                      placeholder="Enter your first name"
                      disabled={!isEditing}
                      required
                    />
                  </div>

                  <div className={styles.profileFormGroup}>
                    <label htmlFor="lastName" className={styles.profileFormLabel}>
                      <User size={18} />
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleInputChange}
                      className={styles.profileFormInput}
                      placeholder="Enter your last name"
                      disabled={!isEditing}
                      required
                    />
                  </div>
                </div>

                <div className={styles.profileFormRow}>
                  <div className={styles.profileFormGroup}>
                    <label htmlFor="dateOfBirth" className={styles.profileFormLabel}>
                      <Calendar size={18} />
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={profileData.dateOfBirth}
                      onChange={handleInputChange}
                      className={styles.profileFormInput}
                      placeholder="Select your date of birth"
                      disabled={!isEditing}
                    />
                  </div>

                  <div className={styles.profileFormGroup}>
                    <label htmlFor="occupation" className={styles.profileFormLabel}>
                      <Briefcase size={18} />
                      Occupation
                    </label>
                    <input
                      type="text"
                      id="occupation"
                      name="occupation"
                      value={profileData.occupation}
                      onChange={handleInputChange}
                      className={styles.profileFormInput}
                      placeholder="Enter your occupation"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information Section */}
              <div className={styles.profileSection}>
                <h3 className={styles.sectionTitle}>Contact Information</h3>
                
                <div className={styles.profileFormGroup}>
                  <label htmlFor="email" className={styles.profileFormLabel}>
                    <Mail size={18} />
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    className={styles.profileFormInput}
                    placeholder="Enter your email address"
                    disabled={true}
                    required
                  />
                </div>

                <div className={styles.profileFormGroup}>
                  <label htmlFor="phoneNumber" className={styles.profileFormLabel}>
                    <Phone size={18} />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={profileData.phoneNumber}
                    onChange={handleInputChange}
                    className={styles.profileFormInput}
                    placeholder="Enter your phone number"
                    disabled={!isEditing}
                  />
                </div>

                <div className={styles.profileFormGroup}>
                  <label htmlFor="address" className={styles.profileFormLabel}>
                    <MapPin size={18} />
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={profileData.address}
                    onChange={handleInputChange}
                    className={styles.profileFormInput}
                    placeholder="Enter your address"
                    disabled={!isEditing}
                  />
                </div>
              </div>

              {/* Form Actions */}
              {isEditing && (
                <div className={styles.profileFormActions}>
                  <button 
                    type="button" 
                    onClick={handleCancel} 
                    className={`${styles.profileBtn} ${styles.profileBtnCancel}`}
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className={`${styles.profileBtn} ${styles.profileBtnSave}`}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </form>
          </div>
          )}
        </div>
      </main>
    </div>
  );
}
