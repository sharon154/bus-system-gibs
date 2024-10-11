import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem('email'); // Retrieve the user's email from localStorage
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get(`/api/v1/ticket/my-bookings/${userId}`); // Fetch bookings by email
                setBookings(response.data.bookings);
            } catch (error) {
                console.error('Error fetching ticket details:', error);
                if (error.response) {
                    if (error.response.status === 404) {
                        setErrorMessage('No bookings found for this email.');
                    } 
                } else {
                    setErrorMessage('An error occurred. Please check your internet connection and try again.');
                }
            } finally {
                setLoading(false); // Set loading to false once done
            }
        };

        fetchBookings(); // Call the function to fetch bookings
    }, [userId]);

    if (loading) {
        return <div>Loading...</div>; // Show loading state while fetching
    }

    return (
        <div className="container vh-100">
            <h1 className="text-center text-white text-uppercase my-4">My Bookings</h1>
            {errorMessage && <div className="alert alert-danger mt-2">{errorMessage}</div>} {/* Display error message */}

            {bookings.length === 0 ? (
                <p>No bookings found.</p> // Message if no bookings exist
            ) : (
                <div className='row'>
                    {bookings.map((booking) => (
                        <div className="col-md-6 mb-4 text-dark" key={booking._id} > {/* Use the MongoDB ID as the key */}
                            <div className="p-3" style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                padding: '20px', // Add some padding
                            }}> {/* Column styling */}
                                <h2 className='text-uppercase text-dark text-center'>Ticket ID: {booking.ticketId}</h2>
                                <p><strong>Bus ID:</strong> {booking.busId} | <strong>Bus Type:</strong> {booking.type}</p>
                                <p><strong>Source:</strong> {booking.source} | <strong>Destination:</strong> {booking.destination}</p>
                                <p><strong>Journey Date:</strong> {new Date(booking.journeyDate).toLocaleString()} | <strong>Booking Date:</strong> {new Date(booking.bookingDate).toLocaleString('en-IN')}</p>
                                <p><strong>Total Fare:</strong> Rs.{booking.totalFare} | <strong>Payment Status: {booking.paymentStatus}</strong></p>
                                <p><strong>Passenger Names:</strong> {booking.passengerNames.join(', ')}</p>
                                <p><strong>Ages:</strong> {booking.ages.join(', ')}</p>
                                <p><strong>Email:</strong> {booking.email}</p>
                                <p><strong>Phone:</strong> +91{booking.phone}</p>
                            </div>
                        </div>

                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookings;
