import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const EditBus = () => {
    const darkMode = useSelector(state => state.auth.darkMode);
    const { busId } = useParams();
    const [busData, setBusData] = useState({
        busId: '',
        capacity: '',
        days: [],
        type: '',
        route: '',
        departureTime: '',
        arrivalTime: '',
        fare: '',
        seatsAvailable: '',
        status: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBus = async () => {
            try {
                const { data } = await axios.get(`/api/v1/bus/admin/${busId}`);
                 setBusData(data.bus);
            } catch (error) {
                setError('Failed to fetch bus details. Please try again later.');
            }
        };
        fetchBus();
    }, [busId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBusData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleDayChange = (day) => {
        const updatedDays = busData.days.includes(day)
            ? busData.days.filter(d => d !== day)
            : [...busData.days, day];
        setBusData((prevData) => ({
            ...prevData,
            days: updatedDays
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/v1/bus/admin/edit-bus/${busId}`, busData);
            alert('Bus updated successfully!');
            navigate('/admin/all-buses');
        } catch (err) {
            if (error.response.status === 401) {
                setError('Failed to update the bus');
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
                            <h1 className="card-title text-center mb-4 text-dark text-uppercase">Edit Bus Details</h1>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Bus ID</label>
                                    <input
                                        type="text"
                                        className="form-control rounded-5"
                                        name="busId"
                                        value={busData.busId}
                                        onChange={handleChange}
                                        disabled
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Capacity</label>
                                    <input
                                        type="number"
                                        className="form-control rounded-5"
                                        name="capacity"
                                        value={busData.capacity}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Days</label>
                                    <div className="row">
                                        {daysOfWeek.map((day) => (
                                            <div key={day} className="col-6">
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        name={day}
                                                        checked={busData.days.includes(day)}
                                                        onChange={() => handleDayChange(day)}
                                                    />{' '}
                                                    {day}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Type</label>
                                    <select
                                        name="type"
                                        value={busData.type}
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
                                <div className="mb-3">
                                    <label className="form-label">Route</label>
                                    <input
                                        type="text"
                                        className="form-control rounded-5"
                                        name="route"
                                        value={busData.route ? `${busData.route.source} to ${busData.route.destination}` : ''}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Departure Time</label>
                                    <input
                                        type="text"
                                        className="form-control rounded-5"
                                        name="departureTime"
                                        value={busData.departureTime}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Arrival Time</label>
                                    <input
                                        type="text"
                                        className="form-control rounded-5"
                                        name="arrivalTime"
                                        value={busData.arrivalTime}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Fare</label>
                                    <input
                                        type="number"
                                        className="form-control rounded-5"
                                        name="fare"
                                        value={busData.fare}
                                        placeholder='500'
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Status</label>
                                    <select
                                        className="form-select rounded-5"
                                        name="status"
                                        value={busData.status}
                                        onChange={handleChange}
                                    >
                                        <option value="Running">Running</option>
                                        <option value="Maintenance">Maintenance</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                                <button type="submit" className="btn btn-dark rounded-5">Update Bus</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditBus;
