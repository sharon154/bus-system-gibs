import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from './AdminLayout';
import { useNavigate } from 'react-router-dom';

const ViewBuses = () => {
    const [buses, setBuses] = useState([]); // Initialize as empty array
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        const fetchBuses = async () => {
            setLoading(true);

            try {
                const { data } = await axios.get('/api/v1/bus/admin/all-buses'); // Adjust URL based on your routes
                setBuses(data.buses || []); // Ensure buses is set to an array
            } catch (err) {
                // setError('Failed to fetch buses. Please try again later.');
                console.error(err);
            }finally {
                setLoading(false);
              }
        };

        fetchBuses();
    }, []);

    const handleEdit = (busId) => {
        navigate(`/admin/edit-bus/${busId}`); // Redirect to the edit page
    };

    const handleDelete = async (busId) => {
        try {
            const confirmed = window.confirm('Are you sure you want to delete this bus?');
            if (confirmed) {
                await axios.delete(`/api/v1/bus/admin/delete/${busId}`);
                // Update bus list after successful deletion
                setBuses((prevBuses) => prevBuses.filter(bus => bus._id !== busId));
                alert('Bus deleted successfully');
            }
        } catch (err) {
            if (error.response.status === 401) {
                setError('Failed to delete the bus');
            } else {
                console.log(error);
            }
        }
    };
    return (
        <AdminLayout>

            <div className="container">
                <h1 className="text-center text-white text-uppercase my-4">All Buses</h1>
                {loading && <div className="alert alert-info mb-2">Loading...</div>}
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="table-responsive">

                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Bus ID</th>
                                <th>Capacity</th>
                                <th>Days</th>
                                <th>Type</th>
                                <th>Route</th>
                                <th>Departure Time</th>
                                <th>Arrival Time</th>
                                <th>Fare</th>
                                <th>Seats Available</th>
                                <th>Status</th>
                                <th>Actions</th>

                            </tr>
                        </thead>
                        <tbody>
                            {buses.length > 0 ? (
                                buses.map(bus => (
                                    <tr key={bus._id}>
                                        <td>{bus.busId}</td>
                                        <td>{bus.capacity}</td>
                                        <td>{bus.days.join(', ')}</td>
                                        <td>{bus.type}</td>
                                        <td>{bus.route ? `${bus.route.source} to ${bus.route.destination}` : 'N/A'}</td>
                                        <td>{bus.departureTime}</td>
                                        <td>{bus.arrivalTime}</td>
                                        <td>Rs.{bus.fare}</td>
                                        <td>{bus.seatsAvailable}</td>
                                        <td>{bus.status}</td>
                                        <td>
                                            <button
                                                className="btn btn-warning text-white btn-sm me-2"
                                                onClick={() => handleEdit(bus._id)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDelete(bus._id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="11" className="text-center">No buses available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>

    );
};

export default ViewBuses;
