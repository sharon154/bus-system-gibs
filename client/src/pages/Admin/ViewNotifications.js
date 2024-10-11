import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';

const ViewNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true); // Set loading to true initially
    const [editIndex, setEditIndex] = useState(null); // State to keep track of which notification is being edited
    const [editMessage, setEditMessage] = useState(''); // State for the edit message

    // Load notifications from localStorage
    useEffect(() => {
        const storedNotifications = JSON.parse(localStorage.getItem('notifications')) || [];
        setNotifications(storedNotifications);
        setLoading(false); // Set loading to false after notifications are loaded
    }, []);
    
    // Function to delete a notification
    const deleteNotification = (indexToDelete) => {
        // Display confirmation dialog
        const confirmDelete = window.confirm("Are you sure you want to delete this notification?");
        
        // If user confirmed, proceed with deletion
        if (confirmDelete) {
            const updatedNotifications = notifications.filter((_, index) => index !== indexToDelete);
            setNotifications(updatedNotifications);
            localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
        }
    };

    // Function to handle updating a notification
    const updateNotification = (index) => {
        const updatedNotifications = [...notifications];
        updatedNotifications[index].message = editMessage; // Update the message of the notification
        setNotifications(updatedNotifications);
        localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
        setEditIndex(null); // Reset the edit index
        setEditMessage(''); // Reset the edit message
    };

    return (
        <AdminLayout>
            <div className="container my-4">
                <h1 className="text-center text-white text-uppercase my-4">All Notifications</h1>
                {loading && <div className="alert alert-info mb-2">Loading...</div>}
                <div className="table-responsive">
                    {notifications.length > 0 ? (
                        <table className="table table-bordered table-striped">
                            <thead className="thead-dark">
                                <tr>
                                    <th scope="col">Index</th>
                                    <th scope="col">Message</th>
                                    <th scope="col">Priority</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {notifications.map((notification, index) => (
                                    <tr key={index}>
                                        <th scope="row">{index + 1}</th>
                                        <td>
                                            {editIndex === index ? (
                                                <input
                                                    type="text"
                                                    value={editMessage}
                                                    onChange={(e) => setEditMessage(e.target.value)}
                                                    placeholder="Edit message"
                                                    className="form-control"
                                                />
                                            ) : (
                                                notification.message
                                            )}
                                        </td>
                                        <td>{notification.priority.charAt(0).toUpperCase() + notification.priority.slice(1)}</td>
                                        <td>
                                            {/* Update Button */}
                                            {editIndex === index ? (
                                                <button
                                                    className="btn btn-success btn-sm rounded-5 me-2"
                                                    onClick={() => updateNotification(index)}
                                                >
                                                    Update
                                                </button>
                                            ) : (
                                                <button
                                                    className="btn btn-warning text-white btn-sm rounded-5 me-2"
                                                    onClick={() => {
                                                        setEditIndex(index);
                                                        setEditMessage(notification.message);
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                            )}
                                            {/* Delete Button */}
                                            <button
                                                className="btn btn-danger btn-sm rounded-5"
                                                onClick={() => deleteNotification(index)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-center">No notifications available.</p>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}

export default ViewNotifications;
