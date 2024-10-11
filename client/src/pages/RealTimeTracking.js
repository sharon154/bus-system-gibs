import React, { useState, useEffect } from 'react';

const RealTimeTracking = () => {
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [userAddress, setUserAddress] = useState('');
    const [GPSlatitude, setGPSLatitude] = useState(null);
    const [GPSlongitude, setGPSLongitude] = useState(null);

    useEffect(() => {
        const geo = navigator.geolocation;
        if (!geo) {
            console.error("Geolocation is not supported by this browser.");
            return;
        }
    
        // Request current position for user location
        geo.getCurrentPosition(userCoords, handleError);

        // Watch position for continuous updates
        const watchId = geo.watchPosition(updateGPSCoords, handleError);

        return () => {
            geo.clearWatch(watchId); // Clear the watch on unmount
        };
    }, []);

    function userCoords(position) {
        const userLatitude = position.coords.latitude;
        const userLongitude = position.coords.longitude;
        setLatitude(userLatitude);
        setLongitude(userLongitude);
        console.log("User Latitude:", userLatitude);
        console.log("User Longitude:", userLongitude);
    }

    function updateGPSCoords(position) {
        const userGPSLatitude = position.coords.latitude;
        const userGPSLongitude = position.coords.longitude;
        setGPSLatitude(userGPSLatitude);
        setGPSLongitude(userGPSLongitude);
        console.log("GPS Latitude:", userGPSLatitude);
        console.log("GPS Longitude:", userGPSLongitude);
    }

    function handleError(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                console.error("User denied the request for Geolocation.");
                break;
            case error.POSITION_UNAVAILABLE:
                console.error("Location information is unavailable.");
                break;
            case error.TIMEOUT:
                console.error("The request to get user location timed out.");
                break;
            case error.UNKNOWN_ERROR:
                console.error("An unknown error occurred.");
                break;
            default:
                console.error("Error getting location:", error);
        }
    }
    

    const getUserAddress = async () => {
        if (latitude !== null && longitude !== null) {
            const url = `https://api.opencagedata.com/geocode/v1/json?key=1ff5ad70aedb45ac8037e53397ba594f&q=${latitude},${longitude}&pretty=1&no_annotations=1`;

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log("User Address Data:", data);

                if (data.results && data.results.length > 0) {
                    setUserAddress(data.results[0].formatted);
                } else {
                    console.log("No results found for the given coordinates.");
                }
            } catch (error) {
                console.error("Error fetching the address:", error);
            }
        } else {
            console.log("Latitude and longitude are not available.");
        }
    };

    const handleGetUserAddress = () => {
        getUserAddress();
    };

    return (
        <>
            <style>
                {`
                    /* General container styling */
                    .real-time-tracking {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        font-weight:800;
                        padding: 40px;
                        color: #ffffff; /* White text for better visibility */
                        border-radius: 12px;
                        max-width: 900px;
                        margin: 20px auto;
                        animation: fadeIn 1s ease-in-out; /* Animation on load */
                    }

                    /* Fade-in animation */
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }

                    /* Individual section cards */
                    .real-time-tracking .card {
                        background-color: rgba(255, 255, 255, 0.6); /* Dark background for cards */
                        padding: 30px;
                        margin: 20px;
                        border-radius: 12px;
                        width: 100%;
                        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
                        text-align: center;
                        transition: transform 0.3s, box-shadow 0.3s;
                    }

                    .real-time-tracking h2 {
                        margin: 10px 0;
                        color: #000000; 
                    }

                    /* Coordinates container styling */
                    .real-time-tracking .coordinates {
                        margin: 10px 0;
                        padding: 15px;
                        background-color: rgba(0, 0, 0, 0.1); /* Slight transparency */
                        border-radius: 10px;
                    }
                

                    /* Responsive adjustments */
                    @media (max-width: 1024px) {

                        .real-time-tracking .action-button {
                            padding: 10px 15px;
                        }
                    }

                    @media (max-width: 768px) {
                        .real-time-tracking {
                            padding: 20px; /* Reduce padding on smaller screens */
                        }

                        .real-time-tracking .card {
                            margin: 10px; /* Reduce margin on cards */
                        }

                    }
                    /* Divider line */
                    .real-time-tracking hr {
                        border: 2px solid white;
                        width: 80%;
                        margin: 40px 0;
                        transition: border-color 0.3s;
                    }

                    .real-time-tracking hr:hover {
                        border-color: #007bff; /* Change color on hover */
                    }
                `}
            </style>
            <div className="real-time-tracking">
                <h1 className="my-4 text-center text-uppercase">Track Your Bus</h1>
                <div className="card">
                    <h2 className='text-dark text-uppercase'>Current Location</h2>
                    <div className="coordinates">
                        <h4>Latitude: {latitude || 'Fetching...'}</h4>
                        <h4>Longitude: {longitude || 'Fetching...'}</h4>
                        <h4>User Address: {userAddress || 'N/A'}</h4>
                    </div>
                    <button className="btn btn-dark rounded-5 p-3" onClick={handleGetUserAddress}>Get User Address</button>
                </div>

                <hr />

                <div className="card">
                    <h1 className='text-uppercase'>GPS Tracking</h1>
                    <div className="coordinates">
                        <h4>GPS Latitude: {GPSlatitude || 'Fetching...'}</h4>
                        <h4>GPS Longitude: {GPSlongitude || 'Fetching...'}</h4>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RealTimeTracking;
