import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CancelTicket = () => {
  const isLogin = useSelector((state) => state.auth.isLogin);
  const [ticketId, setTicketId] = useState('');
  const [ticketDetails, setTicketDetails] = useState(null);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  const handleTicketChange = (e) => {
    const { value } = e.target;

    // Validate ticketId: Only alphanumeric characters are allowed, and no spaces
    const isValid = /^[A-Za-z0-9]+$/.test(value);
    if (!isValid) {
      setErrorMessage('Ticket ID must contain only letters and numbers with no spaces.');
    } else {
      setErrorMessage(''); // Clear error message if valid
    }

    setTicketId(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLogin) {
      const confirmLogin = window.confirm('You need to log in to cancel your ticket. Do you want to log in now?');
      if (confirmLogin) {
        localStorage.setItem("redirectPath", '/cancel-ticket');
        navigate('/login');
      }else {
        return;
      }
    } 
    try {
      const response = await axios.get(`/api/v1/ticket/${ticketId}`);
      setTicketDetails(response.data.ticket); // Assuming the response structure includes the ticket details
      setErrorMessage(''); // Clear any previous error messages
    } catch (error) {
      console.error('Error fetching ticket details:', error);

      // Check if the error response exists and handle specific status codes
      if (error.response) {
        if (error.response.status === 404) {
          setErrorMessage('Ticket ID not found. Please check the ID and try again.');
        } else if (error.response.status === 500) {
          setErrorMessage('Server error. Please try again later.');
        } else if (error.response.status === 400){
          setErrorMessage('You can only cancel tickets with at least 24 hours remaining');

        }
        else {
          setErrorMessage('An unexpected error occurred. Please try again later.');
        }
      } else {
        // Handle errors that do not have a response (like network issues)
        setErrorMessage('An error occurred. Please check your internet connection and try again.');
      }
      setTicketDetails(null); // Clear ticket details on error
    }
  };



  const handleCancelTicket = async () => {
    // Show confirmation dialog
    const confirmed = window.confirm('Are you sure you want to cancel this ticket?');
  
    if (!confirmed) {
      return; // If the user clicked "Cancel", do nothing and return
    }
  
    try {
      const response = await axios.delete(`/api/v1/ticket/cancel/${ticketId}`);
      
      // Show refund amount to the user
      const refundAmount = response.data.refundAmount;
      const refundConfirmed = window.confirm(`Your refund amount will be ${refundAmount}. Refund will be provided soon. Do you want to proceed?`);
  
      if (refundConfirmed) {
        alert('Ticket cancelled successfully');
        navigate(`/my-bookings`); // Redirect after cancellation, adjust as necessary
      }
    } catch (error) {
      console.error('Error cancelling ticket:', error);
      if (error.response) {
        if (error.response.status === 404) {
          setErrorMessage('Ticket ID not found. Please check the ID and try again.');
        } else if (error.response.status === 400) {
          setErrorMessage('You can only cancel tickets with at least 24 hours remaining.');
        }
      } else {
        setErrorMessage('An error occurred. Please check your internet connection and try again.');
      }
    }
  };
  
  return (
    <div>
      <div className="container vh-100 py-4 my-4">
        <h1 className="mb-4 text-center text-uppercase text-white">Cancel Ticket</h1>
        <form onSubmit={handleSubmit} className="d-flex justify-content-center">
          <label htmlFor="ticketId"><i className="fa-solid fa-newspaper text-white fa-3x"></i></label>
          <input
            type="text"
            id="ticketId"
            className="form-control border border-2 rounded-5 w-25 mx-3"
            value={ticketId}
            onChange={handleTicketChange}
            placeholder='Ticket Id'
            style={{ textTransform: 'lowercase' }}
            required
          />
          <button type="submit" className="btn btn-dark border border-2 rounded-5 w-25 mx-2">Submit</button>
        </form>
        {errorMessage && <div className="alert alert-danger mt-2">{errorMessage}</div>} {/* Display error message */}

        {isLogin && ticketDetails && (
          <div className="d-flex justify-content-center align-items-center my-4"> {/* Full height for vertical centering */}
            <div className="text-dark text-center w-50" style={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white
              padding: '20px', // Add some padding
              borderRadius: '8px' // Optional: for rounded corners
            }}>
              <h2 className='text-uppercase fw-bold'>Ticket Details</h2>
              <p><strong>Ticket ID:</strong> {ticketDetails.ticketId}</p>
              <p><strong>Bus ID:</strong> {ticketDetails.busId}</p>
              <p><strong>Passenger Name:</strong> {ticketDetails.passengerNames.join(', ')} | <strong>Passenger Age:</strong> {ticketDetails.ages.join(', ')}</p>
              <p><strong>Source:</strong> {ticketDetails.source} | <strong>Destination:</strong> {ticketDetails.destination}</p>
              <p><strong>Journey Date:</strong> {new Date(ticketDetails.journeyDate).toLocaleString()} | <strong>Booking Date:</strong> {new Date(ticketDetails.bookingDate).toLocaleString('en-IN')}</p>
              <p><strong>Total Fare:</strong> Rs.{ticketDetails.totalFare} | <strong>Payment Status:</strong> {ticketDetails.paymentStatus}</p>
              <button onClick={handleCancelTicket} className="btn btn-danger mx-2">Cancel Ticket</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CancelTicket;
