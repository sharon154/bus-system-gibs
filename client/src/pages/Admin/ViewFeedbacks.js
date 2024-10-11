import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import axios from 'axios';

const ViewFeedbacks = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const { data } = await axios.get('/api/v1/feedbacks/admin/all-feedbacks'); // Adjust URL based on your routes
                setFeedbacks(data.feedbacks || []);

            } catch (err) {
                setError("Failed to fetch feedbacks.");
                console.error(err);
            }
        };

        fetchFeedbacks();
    }, []);

    return (
        <AdminLayout>
            <div className="container">
                <h1 className="text-center text-white text-uppercase my-4">All Feedbacks</h1>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="table-responsive">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Feedback ID</th>
                                <th>Text</th>
                                <th>Created At</th>
                                <th>User name</th>
                                <th>User Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {feedbacks.length > 0 ? (
                                feedbacks.map((feedback) => (
                                    <tr key={feedback.feedbackId}>
                                        <td>{feedback.feedbackId}</td>
                                        <td>{feedback.text}</td>
                                        <td>{new Date(feedback.createdAt).toLocaleString()}</td> {/* Format the date */}
                                        <td>{feedback.name || "N/A"}</td> {/* User's name from populated data */}
                                        <td>{feedback.email || "N/A"}</td> {/* User's email from populated data */}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center">No feedbacks available</td>
                                </tr>
                            )}
                        </tbody>

                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default ViewFeedbacks;
