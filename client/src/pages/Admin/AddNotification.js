// AddNotification.js
import React, { useState } from 'react';
import AdminLayout from './AdminLayout';

const AddNotification = () => {
    const [message, setMessage] = useState('');
    const [priority, setPriority] = useState('general');
    // const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // Get existing notifications from local storage or initialize an empty array
        const notifications = JSON.parse(localStorage.getItem('notifications')) || [];

        // Add the new notification
        const newNotification = { message, priority };
        notifications.push(newNotification);

        // Save the updated notifications array back to local storage
        localStorage.setItem('notifications', JSON.stringify(notifications));

        // Clear form after submission
        setMessage('');
        setPriority('general');

        alert('Notification added successfully!');
    };

    return (
        <AdminLayout>

        <div className="container d-flex justify-content-center align-items-center my-5">
            <div className="row w-100">
                <div className="col-md-6 col-lg-6 mx-auto">
                    {/* {error && <div className="alert alert-danger">{error}</div>} */}
                    <div className='card p-3 shadow'>
                    <h1 className="card-title text-center mb-4 text-dark text-uppercase">Add Notification</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="message" className="form-label">Notification Message</label>
                            <input
                                type="text"
                                id="message"
                                className="form-control rounded-5"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Enter notification message"
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="priority" className="form-label">Priority</label>
                            <select
                                id="priority"
                                className="form-select rounded-5"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                            >
                                <option value="general">General</option>
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
                        </div>

                        <button type="submit" className="btn btn-dark w-100 rounded-5">Add Notification</button>
                    </form>
                    </div>
                    
                </div>
            </div>
        </div>
        </AdminLayout>

    );
};

export default AddNotification;
