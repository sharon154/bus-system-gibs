import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from './AdminLayout'; 

const ViewUsers = () => {
    const [users, setUsers] = useState([]); // Initialize as empty array
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await axios.get('/api/v1/user/admin/all-users'); // Adjust URL based on your routes
                setUsers(data.users || []); // Ensure users is set to an array
            } catch (err) {
                // setError('Failed to fetch users. Please try again later.');
                console.error(err); // For debugging purposes
            }
        };

        fetchUsers();
    }, []);

    return (
        <AdminLayout>
            <div className="container">
                <h1 className="text-center text-white text-uppercase my-4">All Users</h1>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>User Id</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map(user => (
                                <tr key={user._id}>
                                    <td>{user.userId}</td>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center">No users available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default ViewUsers;
