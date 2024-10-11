import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import AdminLayout from './AdminLayout';
import axios from 'axios';


const AddBus = () => {
  const navigate = useNavigate();
  const darkMode = useSelector(state => state.auth.darkMode);

  // State
  const [inputs, setInputs] = useState({
    busId: '',
    capacity: '',
    days: {
      Mon: false,
      Tue: false,
      Wed: false,
      Thu: false,
      Fri: false,
      Sat: false,
      Sun: false,
    },
    type: 'AC',
    route: '',
    routes: [],
    departureTime: '',
    arrivalTime: '',
    fare:'',
    status: 'Running',
  });

  // Fetch routes
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await axios.get('/api/v1/route/admin/all-routes'); // Adjust route according to your API endpoint
        setInputs((prevState) => ({
          ...prevState,
          routes: response.data.routes, // Assuming the API returns an array of route objects
        }));
      } catch (error) {
        console.error('Error fetching routes:', error);
      }
    };

    fetchRoutes();
  }, []);

  const handleDayChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      days: {
        ...prevState.days,
        [e.target.name]: e.target.checked,
      },
    }));
  };

  // Handle change
  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const busIdPattern = /^B[a-zA-Z0-9]{5}$/;
    // if (!busIdPattern.test(inputs.busId)) {
    //   setErrors((prev) => ({ ...prev, busId: 'Bus ID must be exactly 6 alphanumeric characters.' }));
    //   return;
    // }

    try {

      const { data } = await axios.post('/api/v1/bus/admin/add-bus', {
        busId: inputs.busId,
        capacity: inputs.capacity,
        days: Object.keys(inputs.days).filter(day => inputs.days[day]), // Format as array
        type: inputs.type,
        route: inputs.route,
        departureTime: inputs.departureTime,
        arrivalTime: inputs.arrivalTime,
        fare:inputs.fare,
        // seatsAvailable,
        status: inputs.status
      });

      if (data.success) {
        alert("Bus added successfully");
        setInputs({
          busId: '',
          capacity: '',
          days: {
              Mon: false,
              Tue: false,
              Wed: false,
              Thu: false,
              Fri: false,
              Sat: false,
              Sun: false,
          },
          type: 'AC',
          route: '',
          routes: [],
          departureTime: '',
          arrivalTime: '',
          fare: '',
          status: 'Running',
      });
        navigate('/admin/add-bus');
      }
      
    } catch (error) {
      if (error.response) {
          const { status, data } = error.response;

          if (status === 400) {
              setErrors(prev => ({ ...prev, general: data.message || "Bad Request. Please check your inputs." }));
          } else if (status === 401) {
              setErrors(prev => ({ ...prev, busId: "Bus ID already exists." }));
          } else if (status === 500) {
              setErrors(prev => ({ ...prev, general: "Server error. Please try again later." }));
          } else {
              setErrors(prev => ({ ...prev, general: "An unexpected error occurred." }));
          }
      } else {
          console.error(error);
          setErrors({ general: 'Network error, please check your connection' });
      }
  }
  };

  return (
    <AdminLayout>
      <>
        <div className="container d-flex justify-content-center align-items-center my-3">
          <div className="row w-100">
            <div className="col-md-6 col-lg-4 mx-auto">
            <div className={`card ${darkMode ? 'bg-black text-white' : 'bg-white'} p-3 shadow`}>
                <div className="card-body">
                  <h1 className="card-title text-center mb-4 text-dark text-uppercase">Add Bus</h1>
                  <form onSubmit={handleSubmit}>
                    {errors.busId && <span className="alert alert-danger">{errors.busId}</span>}

                    {/* <div>
                      <label>Bus ID:</label>
                      <input
                        type="text"
                        name="busId"
                        value={inputs.busId}
                        onChange={handleChange}
                        required
                        className="form-control"
                      />
                    </div> */}
                    <div>
                      <label>Capacity:</label>
                      <input
                        type="number"
                        name="capacity"
                        value={inputs.capacity}
                        onChange={handleChange}
                        min='30'
                        max='70'
                        required
                        className="form-control rounded-5"
                      />
                    </div>
                    <div>
                      <label>Days:</label>
                      <div className='row'>
                        {Object.keys(inputs.days).map((day) => (
                          <div key={day} className='col-4'>
                            <label>
                              <input
                                type="checkbox"
                                name={day}
                                checked={inputs.days[day]}
                                onChange={handleDayChange}
                              />
                              {day}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label>Type:</label>
                      <select
                        name="type"
                        value={inputs.type}
                        onChange={handleChange}
                        required
                        className="form-control rounded-5"
                      >
                        <option value="AC">AC</option>
                        <option value="Non-AC">Non-AC</option>
                        <option value="Sleeper">Sleeper</option>
                        <option value="Sleeper-AC">Sleeper-AC</option>
                      </select>
                    </div>
                    <div>
                      <label>Route:</label>
                      <select
                        name="route"
                        value={inputs.route}
                        onChange={handleChange}
                        required
                        className="form-control rounded-5"
                      >
                        <option value="">Select a route</option>
                        {inputs.routes.map((route) => (
                          <option key={route._id} value={route._id}>
                            {`${route.routeId} : ${route.source} - ${route.destination}`}
                          </option>
                        ))}
                      </select>
                      {/* <input
                        name="route"
                        value={inputs.route}
                        onChange={handleChange}
                        required
                        className="form-control"
                      >

                      </input> */}
                    </div>
                    <div>
                      <label>Departure Time:</label>
                      <input
                        type="time"
                        name="departureTime"
                        value={inputs.departureTime}
                        onChange={handleChange}
                        required
                        className="form-control rounded-5"
                      />
                    </div>
                    <div>
                      <label>Arrival Time:</label>
                      <input
                        type="time"
                        name="arrivalTime"
                        value={inputs.arrivalTime}
                        onChange={handleChange}
                        required
                        className="form-control rounded-5"
                      />
                    </div>
                    <div>
                      <label>Fare:</label>
                      <input
                        type="number"
                        name="fare"
                        value={inputs.fare}
                        onChange={handleChange}
                        required
                        className="form-control rounded-5"
                      />
                    </div>
                    <div>
                      <label>Status:</label>
                      <select
                        name="status"
                        value={inputs.status}
                        onChange={handleChange}
                        required
                        className="form-control rounded-5"
                      >
                        <option value="Running">Running</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                    <button type="submit" className="btn btn-dark w-100 mt-3 rounded-5">Add Bus</button>
                    </form>

                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </AdminLayout>
  );
};

export default AddBus;
