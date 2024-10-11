import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/v1/user/forgot-password', { email });
      if (data.success) {
        alert("Link to reset Password has been sent to the mail id");
      }
      setError(data.error);
    } catch (error) {
      if (error.response.status === 401) {
        setError('Email is not registerd');
      } else {
        console.log(error);
        setError('Something went wrong');

      }
    }
  };

  return (
    <div className="container py-5 my-5 vh-100">
      <h1 className="card-title text-center mb-4 text-white text-uppercase">Forgot Password</h1>
      <form onSubmit={handleSubmit} className='d-flex justify-content-center'>

        <input
          className='form-control border border-2 rounded-5 mx-3 p-3 w-50'
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />

        <button type="submit" className="btn btn-dark border border-2 rounded-5 mx-3 p-3">Send Reset Link</button>
      </form>
      <div></div>
      {error && <div className="alert alert-danger text-center mt-4">{error}</div>}


    </div>
  );
};

export default ForgotPassword;
