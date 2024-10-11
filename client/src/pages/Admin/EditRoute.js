import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
const EditRoute = () => {

    const darkMode = useSelector(state => state.auth.darkMode);
    const { routeId } = useParams(); // Get the busId from URL params
    const [routeData, setRouteData] = useState({
        routeId: '',
        source: '',
        destination: '',
        distance: '',
        estimatedTime: '',
        stops: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        // Fetch the existing bus data by ID
        const fetchRoute = async () => {
            try {
                const { data } = await axios.get(`/api/v1/route/admin/${routeId}`);
                setRouteData(data.route);
            } catch (err) {
                setError('Failed to fetch route details. Please try again later.');
            }
        };
        fetchRoute();
    }, [routeId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRouteData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/v1/route/admin/edit-route/${routeId}`, routeData);
            alert('Route updated successfully!');
            navigate('/admin/all-routes'); // Redirect back to the view page
        } catch (err) {
            if (error.response.status === 401) {
                setError('Failed to update the route');
            } else {
                console.log(error);
            }
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center my-3">
            <div className="row w-100">
                <div className="col-md-6 col-lg-4 mx-auto">
                    {error && <div className="alert alert-danger">{error}</div>}

                    <div className={`card ${darkMode ? 'bg-black' : 'bg-white'} p-3 shadow`}>
                        <div className="card-body">
                            <h1 className="card-title text-center mb-4 text-dark text-uppercase">Edit Route Details</h1>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Route ID</label>
                                    <input
                                        type="text"
                                        className="form-control rounded-5"
                                        name="routeId"
                                        value={routeData.routeId}
                                        onChange={handleChange}
                                        disabled
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label rounded-5">Source</label>
                                    <input
                                        type="text"
                                        className="form-control rounded-5"
                                        name="source"
                                        value={routeData.source}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Destination</label>
                                    <input
                                        type="text"
                                        className="form-control rounded-5"
                                        name="destination"
                                        value={routeData.destination}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Distance (in km)</label>
                                    <input
                                        type="number"
                                        className="form-control rounded-5"
                                        name="distance"
                                        value={routeData.distance}
                                        onChange={handleChange}
                                        step="0.1"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Estimated Time (HH:MM)</label>
                                    <input
                                        type="text"
                                        className="form-control rounded-5"
                                        name="estimatedTime"
                                        value={routeData.estimatedTime}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Stops (comma-separated)</label>
                                    <input
                                        type="text"
                                        className="form-control rounded-5"
                                        name="stops"
                                        value={routeData.stops}
                                        onChange={handleChange}
                                    />
                                </div>
                                <button type="submit" className="btn btn-dark w-100 mt-3 rounded-5">Update Route</button>
                            </form>                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditRoute;
