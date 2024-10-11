import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const { token } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`/api/v1/user/reset-password/${token}`, { newPassword, confirmPassword });
      if (data.success) {
        alert('Password Reset');
      }
      setMessage(data.message);
    } catch (error) {
      console.log(error);
      setMessage('Error resetting password');
    }
  };

  return (
    <div className="container my-5 py-5 vh-100">
      <div className="text-center">
        <h1 className="card-title mb-4 text-white text-uppercase">Reset Password</h1>

        <form onSubmit={handleSubmit} className="d-flex flex-column align-items-center">
          <input
            className='form-control border border-2 rounded-5 m-2 p-3 w-50'
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            required
          />
          <input
            className='form-control border border-2 rounded-5 m-2 p-3 w-50'
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            required
          />
          <button type="submit" className="btn btn-dark border border-2 rounded-5 m-2 p-3">Reset Password</button>
        </form>
        {message && <p className="text-white">{message}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
