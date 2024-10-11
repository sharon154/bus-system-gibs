import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from './AdminLayout';

const ViewBookings = () => {
    const [bookings, setBookings] = useState([]); // Initialize as empty array
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchBookings = async () => {
            setLoading(true);
        
            try {
                const { data } = await axios.get('/api/v1/ticket/admin/all-bookings');
                console.log("Fetched bookings:", data); // Log the fetched data
        
                // Update this line to reflect the correct key
                setBookings(data.tickets || []); // Ensure bookings is set to an array
            } catch (error) {
                // setError('Failed to fetch bookings. Please try again later.');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        
        

        fetchBookings();
    }, []);

    return (
        <AdminLayout>
            <div className="container mb-4">
                <h1 className="text-center text-white text-uppercase my-4">All Bookings</h1>
                {loading && <div className="alert alert-info mb-2">Loading...</div>}
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="table-responsive">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Ticket ID</th>
                                <th>Bus ID</th>
                                <th>Source</th>
                                <th>Destination</th>
                                <th>Booking Date</th>
                                <th>Journey Date</th>
                                <th>Total Fare</th>
                                <th>Passenger Names</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Payment Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.length > 0 ? (
                                bookings.map(booking => (
                                    <tr key={booking.ticketId}>
                                        <td>{booking.ticketId}</td>
                                        <td>{booking.busId}</td>
                                        <td>{booking.source}</td>
                                        <td>{booking.destination}</td>
                                        <td>{new Date(booking.journeyDate).toLocaleString()}</td>
                                        <td>{new Date(booking.bookingDate).toLocaleString()}</td>
                                        <td>Rs.{booking.totalFare}</td>
                                        <td>{booking.passengerNames.join(', ')}</td>
                                        <td>{booking.email}</td>
                                        <td>{booking.phone}</td>
                                        <td>{booking.paymentStatus}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="11" className="text-center">No bookings available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default ViewBookings;
