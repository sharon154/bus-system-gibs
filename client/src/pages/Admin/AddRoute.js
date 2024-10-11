import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import axios from 'axios';
import AdminLayout from './AdminLayout';

const AddRoute = () => {
    const navigate = useNavigate();
    const darkMode = useSelector(state => state.auth.darkMode);

    // State
    const [inputs, setInputs] = useState({
        routeId: '',
        source: '',
        destination: '',
        distance: '',
        estimatedTime: '',
        stops: ''
    });

    // Handle change
    const handleChange = (e) => {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };

    const [errors, setErrors] = useState({});

    // Handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        const sourcePattern = /^[A-Za-z\s-]+$/;
        const destinationPattern = /^[A-Za-z\s-]+$/;
        const timePattern = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

        if (!sourcePattern.test(inputs.source)) {
            alert('Source field: Only alphabets, spaces, and hyphens are allowed.');
            return;
        }

        if (!destinationPattern.test(inputs.destination)) {
            alert('Destination field: Only alphabets, spaces, and hyphens are allowed.');
            return;
        }

        if (!timePattern.test(inputs.estimatedTime)) {
            alert('Estimated Time: Enter a valid time in HH:MM format.');
            return;
        }

        // const routeIdPattern = /^R[a-zA-Z0-9]{5}$/;
        // if (!routeIdPattern.test(inputs.routeId)) {
        //   setErrors((prev) => ({ ...prev, routeId: 'Route ID must be exactly 6 alphanumeric characters.' }));
        //   return;
        // }
    
        try {
            const { data } = await axios.post('/api/v1/route/admin/add-route', {
                routeId: inputs.routeId,
                source: inputs.source,
                destination: inputs.destination,
                distance: inputs.distance,
                estimatedTime: inputs.estimatedTime,
                stops: inputs.stops.split(',').map(stop => stop.trim()) // Convert stops to an array
            });
            if (data.success) {
                alert("Route added successfully");
                setInputs({
                  routeId: '',
                  source: '',
                  destination:'',
                  distance: '',
                  estimatedTime: '',
                  stops: '', 
                  
                });
                navigate('/admin/add-route');
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {

                setErrors(prev => ({ ...prev, routeId: "Route ID already exists." }));

            } else {
                console.log(error);
            }        }
    };

    return (
        <AdminLayout>
            <>
                <div className="container d-flex justify-content-center align-items-center my-3">
                    <div className="row w-100">
                        <div className="col-md-6 col-lg-4 mx-auto">
                        <div className={`card ${darkMode ? 'bg-black text-white' : 'bg-white'} p-3 shadow`}>
                        <div className="card-body">
                                    <h1 className="card-title text-center mb-4 text-dark text-uppercase">Add Route</h1>

                                    <form onSubmit={handleSubmit}>
                                    {errors.routeId && <span className="text-danger">{errors.routeId}</span>}
                                    <div>
                      <p className="text-muted text-center">Route ID will be generated automatically.</p>
                    </div>
                                        {/* <div className="form-group">
                                            <label>Route Id:</label>
                                            <input
                                                type="text"
                                                name="routeId"
                                                value={inputs.routeId}
                                                onChange={handleChange}
                                                className="form-control rounded-5"
                                                required
                                            />
                                        </div> */}
                                        <div className="form-group">
                                            <label>Source:</label>
                                            <input
                                                type="text"
                                                name="source"
                                                value={inputs.source}
                                                onChange={handleChange}
                                                className="form-control rounded-5"
                                                pattern="^[A-Za-z\s-]+$" // Correct pattern usage
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Destination:</label>
                                            <input
                                                type="text"
                                                name="destination"
                                                value={inputs.destination}
                                                onChange={handleChange}
                                                className="form-control rounded-5"
                                                pattern="^[A-Za-z\s-]+$" // Correct pattern usage
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Distance (in km):</label>
                                            <input
                                                type="number"
                                                name="distance"
                                                value={inputs.distance}
                                                onChange={handleChange}
                                                className="form-control rounded-5"
                                                placeholder='ex. 130.5'
                                                step="0.1"
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Estimated Time: (HH:MM)</label>
                                            <input
                                                type="text"
                                                name="estimatedTime"
                                                value={inputs.estimatedTime}
                                                onChange={handleChange}
                                                className="form-control rounded-5"
                                                pattern="^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$" // Validates HH:MM format
                                                placeholder="ex. 03:30"
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Stops (comma-separated):</label>
                                            <input
                                                type="text"
                                                name="stops"
                                                value={inputs.stops}
                                                onChange={handleChange}
                                                className="form-control rounded-5"
                                            />
                                        </div>
                                        <button type="submit" className="btn btn-dark w-100 mt-3 rounded-5">Add Route</button>
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

export default AddRoute;
