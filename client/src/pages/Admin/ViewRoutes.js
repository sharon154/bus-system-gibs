import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from './AdminLayout';
import { useNavigate } from 'react-router-dom';

const ViewRoutes = () => {
    const [routes, setRoutes] = useState([]); // Initialize as empty array
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRoutes = async () => {
            setLoading(true);

            try {
                const { data } = await axios.get('/api/v1/route/admin/all-routes'); // Adjust URL based on your routes
                setRoutes(data.routes || []); // Ensure routes is set to an array
            } catch (err) {
                // setError('Failed to fetch routes. Please try again later.');
                console.error(err); // For debugging purposes
            }finally {
                setLoading(false);
              }
        };

        fetchRoutes();
    }, []);

    const handleEdit = (routeId) => {
        navigate(`/admin/edit-route/${routeId}`); // Redirect to the edit page
    };

    const handleDelete = async (routeId) => {
        try {
            const confirmed = window.confirm('Are you sure you want to delete this route?');
            if (confirmed) {
                await axios.delete(`/api/v1/route/admin/delete/${routeId}`);
                // Update bus list after successful deletion
                setRoutes((prevRoutes) => prevRoutes.filter(route => route._id !== routeId));
                alert('Route deleted successfully');
            }
        } catch (err) {
            if (error.response.status === 401) {
                setError('Failed to delete the route');
            } else {
                console.log(error);
            }
        }
    };
    return (
        <AdminLayout>
            <div className="container">
                <h1 className="text-center text-white text-uppercase my-4">All Routes</h1>
                {loading && <div className="alert alert-danger mb-2">Loading...</div>}
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Route ID</th>
                            <th>Source</th>
                            <th>Destination</th>
                            <th>Distance</th>
                            <th>Estimated Time</th>
                            <th>Stops</th>
                            <th>Actions</th>

                        </tr>
                    </thead>
                    <tbody>
                        {routes.length > 0 ? (
                            routes.map(route => (
                                <tr key={route._id}>
                                    <td>{route.routeId}</td>
                                    <td>{route.source}</td>
                                    <td>{route.destination}</td>
                                    <td>{route.distance} km</td>
                                    <td>{route.estimatedTime} hrs</td>
                                    <td>{route.stops.join(', ')}</td>
                                    <td>
                                            <button
                                                className="btn btn-warning text-white btn-sm me-2"
                                                onClick={() => handleEdit(route._id)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDelete(route._id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center">No routes available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default ViewRoutes;
