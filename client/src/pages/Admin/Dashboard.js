import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { useSelector } from 'react-redux';
import axios from 'axios';

const Dashboard = () => {
    const darkMode = useSelector(state => state.auth.darkMode);
    const [stats, setStats] = useState({
        users: 0,
        bookings: 0,
        buses: 0,
        routes: 0,
        feedbacks: 0,
    });

    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                const response = await axios.get('/api/v1/stats/admin/dashboard'); // Update with your correct API endpoint
                setStats(response.data); // Assuming the response structure matches
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
            }
        };

        fetchDashboardStats();
    }, []);

    return (
        <AdminLayout>
            <div className="container my-5 px-5">
                <div className="row mb-2">
                    <div className="col-md-4 mb-3">
                        <div className={`card ${darkMode ? 'bg-black' : 'bg-white'} shadow text-center p-5 mx-4`}>
                            <div className="card-body text-success">
                                <i className="fa-solid fa-users fa-2x"></i>
                                <h4 className="card-title">{stats.users} Users</h4>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 mb-3">
                        <div className={`card ${darkMode ? 'bg-black' : 'bg-white'} shadow text-center p-5 mx-4`}>
                            <div className="card-body text-primary">
                                <i className="fa-solid fa-clipboard-list fa-2x"></i>
                                <h5 className="card-title">{stats.bookings} Bookings</h5>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 mb-3">
                        <div className={`card ${darkMode ? 'bg-black' : 'bg-white'} shadow text-center p-5 mx-4`}>
                            <div className="card-body text-danger">
                                <i className="fa-solid fa-bus fa-2x"></i>
                                <h5 className="card-title">{stats.buses} Buses</h5>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row mt-2">
                    <div className="col-md-6 mb-3">
                        <div className={`card ${darkMode ? 'bg-black' : 'bg-white'} shadow text-center p-5 mx-4`}>
                            <div className="card-body text-info">
                                <i className="fa-solid fa-route fa-2x"></i>
                                <h5 className="card-title">{stats.routes} Routes</h5>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 mb-3">
                        <div className={`card ${darkMode ? 'bg-black' : 'bg-white'} shadow text-center p-5 mx-4`}>
                            <div className="card-body text-warning">
                                <i className="fa-solid fa-message fa-2x"></i>
                                <h5 className="card-title">{stats.feedbacks} Feedbacks</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Dashboard;
