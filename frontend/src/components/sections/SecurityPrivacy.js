import React, { useState } from 'react';
import axios from 'axios';
import './SecurityPrivacy.css';

const SecurityPrivacy = () => {
  const loggedInUser = JSON.parse(localStorage.getItem("user") || '{}');
  const userId = loggedInUser?.id || '';
  const userToken = localStorage.getItem("userToken") || '';
  
  // Debug information for development
  console.log("User token:", userToken ? "Found" : "Missing");
  console.log("User ID:", userId || "Missing");
  
  // State for password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // State for delete account
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  // State for messages
  const [message, setMessage] = useState({ text: '', type: '' });
  
  // Handle password change form inputs
  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  // Submit password change
  const submitPasswordChange = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    
    // Validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ text: 'New passwords do not match', type: 'error' });
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setMessage({ text: 'Password must be at least 8 characters long', type: 'error' });
      return;
    }
    
    console.log('Attempting to update password for user ID:', userId);
    
    try {
      console.log('Sending password change request...');
      
      if (!userToken) {
        throw new Error("Authentication token not found. Please log in again.");
      }
      
      const response = await axios.post('http://localhost:8080/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, {
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Password update response:', response.data);
      setMessage({ text: 'Password updated successfully!', type: 'success' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => {
        setShowPasswordModal(false);
      }, 2000);
    } catch (error) {
      console.error('Password update failed:', error);
      
      let errorMessage = 'Failed to update password';
      
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        errorMessage = error.response?.data?.message || 'Failed to update password';
      }
      
      setMessage({ text: errorMessage, type: 'error' });
    }
  };
  
  // Delete account confirmation
  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE') {
      setMessage({ text: 'Please type DELETE to confirm account deletion', type: 'error' });
      return;
    }
    
    try {
      const userToken = localStorage.getItem("userToken");
      
      await axios.delete(`http://localhost:8080/auth/delete-account`, {
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Clear all local storage items related to user session
      localStorage.removeItem('user');
      localStorage.removeItem('userToken');
      
      // Redirect to login page
      window.location.href = '/login';
    } catch (error) {
      console.error('Account deletion failed:', error);
      
      let errorMessage = 'Failed to delete account';
      
      if (error.response) {
        errorMessage = error.response.data?.message || 'Failed to delete account';
      }
      
      setMessage({ 
        text: errorMessage, 
        type: 'error' 
      });
    }
  };
  
  return (
    <div className="security-privacy-container">
      <h3>Security & Privacy</h3>
      
      <div className="security-option">
        <div className="security-option-info">
          <h4>Password Management</h4>
          <p>Change your account password</p>
        </div>
        <button 
          className="change-password-btn" 
          onClick={() => setShowPasswordModal(true)}
        >
          Change Password
        </button>
      </div>
      
      <div className="security-option danger-zone">
        <div className="security-option-info">
          <h4>Danger Zone</h4>
          <p>Permanently delete your account and all associated data</p>
        </div>
        <button 
          className="delete-account-btn" 
          onClick={() => setShowDeleteModal(true)}
        >
          Delete Account
        </button>
      </div>
      
      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Change Password</h3>
            <form onSubmit={submitPasswordChange}>
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              
              {message.text && (
                <div className={`message ${message.type}`}>
                  {message.text}
                </div>
              )}
              
              <div className="modal-buttons">
                <button type="button" onClick={() => setShowPasswordModal(false)}>Cancel</button>
                <button type="submit" className="update-password-btn">Update Password</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content delete-modal">
            <h3>Delete Account</h3>
            <p className="warning">
              Warning: This action is irreversible and will permanently delete your account and all associated data.
            </p>
            <p>To confirm deletion, please type <strong>DELETE</strong> in the field below:</p>
            <input
              type="text"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              className="delete-confirmation"
              placeholder="Type DELETE to confirm"
            />
            
            {message.text && (
              <div className={`message ${message.type}`}>
                {message.text}
              </div>
            )}
            
            <div className="modal-buttons">
              <button type="button" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button 
                type="button" 
                className="delete-btn" 
                onClick={handleDeleteAccount}
                disabled={deleteConfirmation !== 'DELETE'}
              >
                Permanently Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityPrivacy;
