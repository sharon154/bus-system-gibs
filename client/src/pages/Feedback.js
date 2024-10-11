import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import './Feedback.css'; // Make sure to import the CSS file
import { useNavigate } from 'react-router-dom';

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [newFeedback, setNewFeedback] = useState("");
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingFeedback, setEditingFeedback] = useState(null);
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const feedbacksPerPage = 5;
  const darkMode = useSelector(state => state.auth.darkMode);
  const isLogin = useSelector((state) => state.auth.isLogin);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const { data } = await axios.get('/api/v1/feedbacks/admin/all-feedbacks');
        setFeedbacks(data.feedbacks);
      } catch (error) {
        console.error('Error fetching ticket details:', error);
        if (error.response) {
          if (error.response.status === 404) {
            setError('Feedbacks not found. Please try later.');
          }
        } else {
          setError('An error occurred. Please check your internet connection and try again.');
        }
      }
    };

    fetchFeedbacks();

    // const emailFromStorage = localStorage.getItem('email');
    // console.log(emailFromStorage)
    // const usernameFromStorage = localStorage.getItem('username'); // Fetch username from local storage
    // if (emailFromStorage) {
    //   setIsLoggedIn(true);
    //   setUserEmail(emailFromStorage);
    // }
    const usernameFromStorage = localStorage.getItem('username'); // Fetch username from local storage
    const emailFromStorage = localStorage.getItem('email');
    if (emailFromStorage) {
        setUserEmail(emailFromStorage);
      }
    if (usernameFromStorage) {
      setUserName(usernameFromStorage); // Set the username state
    }
  }, []);

  const handleSubmitFeedback = async () => {
    // if (!isLoggedIn) {
    //   setError("Dear user, please login to submit feedback.");
    //   return;
    // }
    if (!isLogin) {
      const confirmLogin = window.confirm('You need to log in to provide feedback. Do you want to log in now?');
      if (confirmLogin) {
        localStorage.setItem("redirectPath", '/feedback');
        navigate('/login');
      } else {
        return;
      }
    }
    if (newFeedback.trim() === "") {
      setError("Feedback is required!");
      return;
    }

    setError('');
    setSuccess('');

    try {
      if (editingFeedback) {
        const updatedFeedback = await axios.put(`/api/v1/feedbacks/${editingFeedback._id}`, {
          text: newFeedback,
          name: userName, // Use username instead of email
        });
        setFeedbacks(feedbacks.map(feedback => feedback._id === editingFeedback._id ? updatedFeedback.data : feedback));
        setSuccess("Feedback updated successfully!");
      } else {
        const feedbackResponse = {
          text: newFeedback,
          name: userName, // Use username instead of email
          email: userEmail // Email can still be included
        };
        const response = await axios.post('/api/v1/feedbacks/', feedbackResponse);
        setFeedbacks([response.data, ...feedbacks]);
        setSuccess("Feedback submitted successfully!");
      }

      setNewFeedback("");
      setEditingFeedback(null);
    } catch (err) {
      setError("Failed to submit/update feedback. Please try again.");
      console.error(err);
    }
  };

  const handleDeleteFeedback = async (id) => {
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      try {
        await axios.delete(`/api/v1/feedbacks/${id}`);
        setFeedbacks(feedbacks.filter(feedback => feedback._id !== id));
        setSuccess("Feedback deleted successfully!");
      } catch (err) {
        setError("Failed to delete feedback. Please try again.");
        console.error(err);
      }
    }
  };

  const handleEditFeedback = (feedback) => {
    setNewFeedback(feedback.text);
    setEditingFeedback(feedback);
  };

  const currentFeedbacks = feedbacks.slice(currentPage * feedbacksPerPage, (currentPage + 1) * feedbacksPerPage);
  const hasMoreFeedbacks = currentPage < Math.floor(feedbacks.length / feedbacksPerPage);
  const hasPreviousFeedbacks = currentPage > 0;

  return (
    <div>
      <div className="container py-4 my-5">
        <h1 className="mb-4 text-center text-uppercase text-white">Feedback</h1>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <div className="mb-4">
          <textarea
            className={`form-control ${darkMode ? 'feedback-textarea-dark' : 'feedback-textarea-light'}`}
            placeholder="Write your feedback here..."
            rows="4"
            value={newFeedback}
            onChange={(e) => setNewFeedback(e.target.value)}
          ></textarea>
          <button
            className='btn btn-dark mt-2 rounded-5 border-white p-2 w-25'
            onClick={handleSubmitFeedback}
          >
            {editingFeedback ? "Update Feedback" : "Submit Feedback"}
          </button>
          {editingFeedback && (
            <button
              className={`btn ${darkMode ? 'btn-secondary' : 'btn-light'} mt-2 mx-2`}
              onClick={() => {
                setEditingFeedback(null);
                setNewFeedback('');
              }}
            >
              Cancel Edit
            </button>
          )}
        </div>

        <h2 className="text-center text-uppercase text-white my-4" style={{ color: darkMode ? '#ffffff' : '#000000' }}>
          Recent Feedbacks
        </h2>

        {currentFeedbacks.length > 0 ? (
          <table className={`table table-responsive ${darkMode ? 'table-dark' : 'table-light'}`}>
            <thead>
              <tr>
                <th>Feedback</th>
                <th>Name</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentFeedbacks.map((feedback) => (
                <tr
                  key={feedback._id}
                  className={feedback.name === userEmail ? 'table-info' : ''}
                  style={{ fontWeight: feedback.name === userEmail ? 'bold' : 'normal' }}>

                  <td>{feedback.text}</td>
                  <td>{feedback.name}</td>
                  <td>{new Date(feedback.createdAt).toLocaleString()}</td>
                  <td>
                    {isLogin && feedback.email === userEmail ? (
                      <>
                        <button
                          className="btn btn-warning text-white btn-sm me-2"
                          onClick={() => handleEditFeedback(feedback)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteFeedback(feedback._id)}
                        >
                          Delete
                        </button>
                      </>
                    ) : (
                      <span className="text-muted">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center">No feedbacks yet.</div>
        )}
        <div className="d-flex justify-content-between my-3">
          {hasPreviousFeedbacks && (
            <button className="btn btn-secondary" onClick={() => setCurrentPage(currentPage - 1)}>
              Previous
            </button>
          )}
          {hasMoreFeedbacks && (
            <button className="btn btn-secondary" onClick={() => setCurrentPage(currentPage + 1)}>
              Next
            </button>
          )}
        </div>

      </div>
    </div>
  )
}

export default Feedback;
