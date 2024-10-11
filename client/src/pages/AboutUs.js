import React from 'react';
import './AboutUs.css';

const AboutUs = () => {

    return (
        <div className="container">
            <h1 className="text-center text-white text-uppercase my-4">About Us</h1>
            <div className="row h-75 mx-4">
                <div className="col-md-6 d-flex justify-content-center align-items-center mb-4">
                <div className='card shadow text-center'>
                <div className="card-body p-5">
                            <h2 className="card-title text-info">Our Mission</h2>
                            <p className="card-text fs-6 mt-3">
                                Our mission is to provide a seamless and efficient bus booking experience, ensuring comfort and convenience for all travelers.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 d-flex justify-content-center align-items-center mb-4">
                    <div className='card shadow text-center'>
                        <div className="card-body p-5">
                            <h2 className="card-title text-info">Our Vision</h2>
                            <p className="card-text fs-6 mt-3">
                                Our vision is to be the leading bus service provider, recognized for our exceptional service and commitment to customer satisfaction.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 d-flex justify-content-center align-items-center mb-4">
                <div className='card shadow text-center'>
                <div className="card-body p-5">
                            <h2 className="card-title text-info">Our Values</h2>
                            <p className="card-text fs-6 mt-3">
                                We value integrity, customer focus, and innovation in all our services, ensuring that quality and trust remain at the core of everything we do.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 d-flex justify-content-center align-items-center mb-4">
                <div className='card shadow text-center'>
                <div className="card-body p-5">
                            <h2 className="card-title text-info">Our Commitment</h2>
                            <p className="card-text fs-6 mt-3">
                                We are committed to providing safe, reliable, and affordable bus services that meet the needs of our diverse customer base.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AboutUs;
