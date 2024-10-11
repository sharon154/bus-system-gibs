import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BusSchedule = () => {
  const [buses, setBuses] = useState([]);
  const [selectedBusId, setSelectedBusId] = useState('');
  const [busSchedule, setBusSchedule] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const { data } = await axios.get('/api/v1/bus/admin/all-buses');
        setBuses(data.buses || []); // Ensure buses is set to an array
      } catch (error) {
        console.error('Error fetching ticket details:', error);
        if (error.response) {
            if (error.response.status === 404) {
                setError('Buses not found. Please try later.');
            } 
        } else {
            setError('An error occurred. Please check your internet connection and try again.');
        }      }
    };

    fetchBuses();
  }, []);

  const handleBusChange = (event) => {
    setSelectedBusId(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(''); // Clear any previous error messages
  
    try {
      const { data } = await axios.get(`/api/v1/bus/schedule/${selectedBusId}`);
      setBusSchedule(data.bus); // Set the bus object as the schedule
    } catch (err) {
      console.error(err); // For debugging purposes
      setError('Failed to fetch bus schedule. Please try again later.');
    } finally {
      setLoading(false); // Always set loading to false at the end
    }
  };
  

  const calculateArrivalTimes = (departureTime, stops) => {
    const arrivalTimes = [];
    
    const today = new Date();
    const [hours, minutes] = departureTime.split(':').map(Number);

    if (isNaN(hours) || isNaN(minutes)) {
      console.error('Invalid departure time format:', departureTime);
      return arrivalTimes;
    }

    const departureDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes);

    if (isNaN(departureDate.getTime())) {
      console.error('Invalid departure date:', departureDate);
      return arrivalTimes;
    }

    stops.forEach((stop, index) => {
      let arrivalTime;

      if (index === 0) {
        arrivalTime = new Date(departureDate.getTime() + 1 * 60 * 60 * 1000);
      } else {
        arrivalTime = new Date(arrivalTimes[index - 1].arrivalTime.getTime() + 1.5 * 60 * 60 * 1000);
      }

      arrivalTimes.push({ stop, arrivalTime });
    });

    return arrivalTimes.map(item => ({
      stop: item.stop,
      arrivalTime: item.arrivalTime.toTimeString().slice(0, 5),
    }));
  };

  return (
    <>
      <div className="container py-4 my-4 vh-100">
        <h1 className="mb-4 text-center text-uppercase text-white">BUS SCHEDULE</h1>
        {loading && <div className="alert alert-info mb-2">Loading...</div>}
        {error && <div className="alert alert-danger mb-2">{error}</div>}

        <form onSubmit={handleSubmit} className='d-flex justify-content-center'>
          <label htmlFor="busId"><i className="fa-solid fa-bus text-white fa-3x"></i></label>
          <select
            id="busId"
            className='form-control border border-2 rounded-5 w-25 mx-3'
            value={selectedBusId}
            onChange={handleBusChange}
            required
          >
            <option value="">--Select Bus ID--</option>
            {buses.map((bus) => (
              <option key={bus._id} value={bus.busId}>
                {bus.busId}
              </option>
            ))}
          </select>
          <button type="submit" className="btn btn-dark border border-2 rounded-5 w-25 mx-2">Get Schedule</button>
        </form>

        {busSchedule && (
          <div className="bus-schedule-details mt-4" style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent white
            padding: '20px', // Add some padding
            borderRadius: '8px',
          }}>
            <h2 className='text-white text-uppercase text-center'>Schedule for Bus: {busSchedule.busId}</h2>
            <table className="schedule-table table table-bordered">
              <thead>
                <tr>
                  <th>Source</th>
                  <th>Departure Time</th>
                  <th>Destination</th>
                  <th>Arrival Time</th>
                  <th>Days</th>
                  <th>Stops</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{busSchedule.route.source}</td>
                  <td>{busSchedule.departureTime}</td>
                  <td>{busSchedule.route.destination}</td>
                  <td>{busSchedule.arrivalTime}</td>
                  <td>{busSchedule.days.join(', ')}</td>
                  <td>{busSchedule.route.stops ? busSchedule.route.stops.join(', ') : 'No stops'}</td>
                </tr>
              </tbody>
            </table>
            {busSchedule.route?.stops && (
              <div>
                <h3 className='text-white text-uppercase text-center'>Arrival Times at Stops:</h3>
                <ul className="list-group text-center fw-bold">
                  {calculateArrivalTimes(busSchedule.departureTime, busSchedule.route.stops).map((item, index) => (
                    <li key={index} className="list-group-item">
                      {item.stop}: {item.arrivalTime}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default BusSchedule;
