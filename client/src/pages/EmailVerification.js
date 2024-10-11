import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
const EmailVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Function to get query parameters
  const getQueryParams = () => {
    return new URLSearchParams(location.search);
  };

  const token = getQueryParams().get('token');

  const handleContinue = async () => {
    try {
      console.log(`Token: ${token}`);
      const response = await axios.get(`/api/v1/user/verify-email?token=${token}`); // Adjust the URL based on your API structure
      if (response.data.success) {
        // Optionally show a success message or redirect
        navigate('/'); // Navigate to the login page
      }
    } catch (error) {
      console.error(error);
      // Optionally show an error message to the user
    }
  };
  
  return (
    <div className="container d-flex flex-column justify-content-center align-items-center vh-100">
      <h1 className="text-center mb-4 text-white text-uppercase">Email Verification</h1>
      <div className="card text-center shadow" style={{ width: '300px' }}>
        <div className="card-body">
          {token ? (
            <>
              <div className="text-success" style={{ fontSize: '70px' }}>
                <i className="fa-solid fa-check-circle"></i>
              </div>
              <h5 className="card-title">Your email is verified</h5>
              
            </>
          ) : (
            <>
              <div className="text-danger" style={{ fontSize: '70px' }}>
                <i className="fa-solid fa-times-circle"></i>
              </div>
              <h5 className="card-title">Email verification error</h5>
              <p>Please try again later.</p>
            </>
          )}
          
        </div>
      </div>
      <button className="btn btn-dark border border-2 rounded-5 my-3 p-2 w-25" onClick={handleContinue}>
      <i className="fa-solid fa-backward me-1"></i>Continue
          </button>
    </div>
  );
};

export default EmailVerification;
