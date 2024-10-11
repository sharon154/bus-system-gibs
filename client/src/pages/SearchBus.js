import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SearchBus = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const [inputs, setInputs] = useState({
    source: '',
    destination: '',
    date: '',
    type: '',
  });
  const [locations, setLocations] = useState([]);

  const getCurrentDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  useEffect(() => {
    setInputs(prevInputs => ({ ...prevInputs, date: getCurrentDate() }));
    
    const fetchRoutes = async () => {
      try {
        const response = await axios.get('/api/v1/route/admin/all-routes');
        const allLocations = [];
  
        // Add source, destination, and stops to the locations array
        response.data.routes.forEach(route => {
          // Push source and destination
          allLocations.push(route.source, route.destination);
  
          // Push each stop to the array
          route.stops.forEach(stop => {
            allLocations.push(stop);
          });
        });
  
        // Remove duplicates and sort alphabetically
        const uniqueLocations = [...new Set(allLocations)].sort((a, b) => a.localeCompare(b));
  
        setLocations(uniqueLocations);
      } catch (error) {
        console.error('Error fetching routes:', error);
      }
    };
  
    fetchRoutes();
  }, []);
  
  useEffect(() => {
    if (inputs.date) {
      localStorage.setItem('date', inputs.date);
      console.log('Date saved to localStorage:', inputs.date);

    }
  }, [inputs.date]);
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update the state with the new value
    setInputs((prevState) => ({
      ...prevState,
      [name]: value
    }));

    // Store source and destination values in local storage when they change
    if (name === 'source') {
      localStorage.setItem('source', value);
      console.log('Source saved to localStorage:', value); // Log the source value

    } else if (name === 'destination') {
      localStorage.setItem('destination', value);
      console.log('Destination saved to localStorage:', value); // Log the destination value

    } else if (name === 'date') {
      localStorage.setItem('date', value);
      console.log('Date saved to localStorage:', value); // Log the date value
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (inputs.source === inputs.destination) {
      setError('Please select different locations for source and destination');
      return;
    }

    try {
      const response = await axios.post('/api/v1/bus/bus-list', {
        source: inputs.source,
        destination: inputs.destination,
        date: inputs.date,
        type: inputs.type
      });

      navigate('/bus-list', {
        state: {
          data: response.data.data
        }
      });
    } catch (error) {
      console.error('Error fetching buses', error);
      setError('There was an error fetching buses. Please try again later.');
    }
  };

  const showToast = () => {
    const toastElement = document.getElementById('liveToast');
    const toast = new window.bootstrap.Toast(toastElement);
    toast.show();
  };

  const [latestNotification, setLatestNotification] = useState(null);

  // Load the latest notification from localStorage
  useEffect(() => {
    const storedNotifications = JSON.parse(localStorage.getItem('notifications')) || [];
    if (storedNotifications.length > 0) {
      setLatestNotification(storedNotifications[storedNotifications.length - 1]); // Get the most recent notification
    }
  }, []);
  return (
    <div className="container-fluid vh-100">
      <div className="row justify-content-end w-25 mt-2 ms-auto me-3">
        <button
          type="button"
          className="btn btn-dark btn-lg rounded px-3 me-2 border-white" // Adjust padding and add margin
          style={{ maxWidth: '60px', minWidth: '50px' }} // Set max and min width for responsiveness
          id="liveToastBtn"
          onClick={showToast}
        >
          <i className="fa-solid fa-bell text-white"></i>
        </button>
        {latestNotification && (

          <div className="toast-container position-fixed end-0 top-0 p-3">
            <div
              id="liveToast"
              className="toast"
              role="alert"
              aria-live="assertive"
              aria-atomic="true"
              style={{ maxWidth: '300px' }} // Optional: Limit the width for smaller screens
            >
              <div className="toast-header">
                <i className="fa-solid fa-bell text-dark"></i>
                <strong className="me-auto">
                  <a href="/notifications" className="text-decoration-none text-dark">Notifications</a>
                </strong>
                <small>Recent</small>
                <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
              </div>
              <div className="toast-body">
                {latestNotification.message}
              </div>
            </div>
          </div>
        )}

      </div>

      <div className="row w-100">
        <div className="col-md-6 offset-md-1">
          {error && <div className="alert alert-danger mb-4">{error}</div>}

          <div className='card p-4 shadow'>
            <h1 className="text-center mb-4 text-dark text-uppercase">Book Ticket</h1>
            <form onSubmit={handleSubmit}>
              <div className="form-group d-flex align-items-center mb-3">
                <label htmlFor="source"><i className="fa-brands fa-sourcetree fa-2x text-dark me-2"></i></label>
                <select
                  id="source"
                  className="form-control border border-2 rounded-5"
                  name='source'
                  value={inputs.source}
                  onChange={handleChange} required
                >
                  <option value="">Select Source</option>
                  {locations.map((location, index) => (
                    <option key={index} value={location}>
                      {location}
                    </option>
                  ))}

                </select>
              </div>
              <div className="form-group d-flex align-items-center mb-3">
                <label htmlFor="destination"><i className="fa-solid fa-location-dot fa-2x text-dark me-2"></i></label>
                <select
                  id="destination"
                  className="form-control border border-2 rounded-5"
                  name='destination'
                  value={inputs.destination}
                  onChange={handleChange} required
                >
                  <option value="">Select Destination</option>
                  {locations.map((location, index) => (
                    <option key={index} value={location}>
                      {location}
                    </option>
                  ))}

                </select>
              </div>
              <div className="form-group d-flex align-items-center mb-3">
                <label htmlFor="date"><i className="fa-solid fa-calendar-days fa-2x text-dark me-2"></i></label>
                <input
                  type="date"
                  id="date"
                  className="form-control border border-2 rounded-5"
                  name='date'
                  value={inputs.date}
                  onChange={handleChange}
                  min={getCurrentDate()} // Set the min attribute to the current date
                />
              </div>
              <div className="form-group d-flex align-items-center mb-3">
                <label htmlFor="type"><i className="fa-solid fa-bus fa-2x text-dark me-2"></i></label>
                <select
                  id="type"
                  className="form-control border border-2 rounded-5"
                  name='type'
                  value={inputs.type}
                  onChange={handleChange} required
                >
                  <option value="">Select Bus Type</option>
                  <option value="AC">AC</option>
                  <option value="Non-AC">Non-AC</option>
                  <option value="Sleeper">Sleeper</option>
                  <option value="Sleeper-AC">Sleeper-AC</option>
                </select>
              </div>
              <div className='d-flex justify-content-center'>
                <button type="submit" className="btn btn-dark w-100 mt-3 rounded-5">Search</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBus;
