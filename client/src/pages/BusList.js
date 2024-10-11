import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import './BusList.css'; // Make sure this path is correct
import { load } from '@cashfreepayments/cashfree-js'

const BusList = () => {
  const isLogin = useSelector(state => state.auth.isLogin); // Check login status
  const location = useLocation();
  const navigate = useNavigate();
  const buses = location.state?.data || [];

  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [selectedBus, setSelectedBus] = useState(null); // To store the bus being booked
  const initialFormData = {
    passengers: 1,
    passengerNames: [''],
    ages: [''],
    email: '',
    phone: '',
    journeyDate: '',
    totalFare: 0
  };

  const [formData, setFormData] = useState(initialFormData);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updates = {}; // Object to hold updates

    if (name === 'passengers') {
      const numberOfPassengers = parseInt(value) || 0;
      const newPassengerNames = Array.from({ length: numberOfPassengers }, (_, i) => formData.passengerNames[i] || '');
      const newAges = Array.from({ length: numberOfPassengers }, (_, i) => formData.ages[i] || '');
      const fare = selectedBus ? selectedBus.fare : 0;

      // Recalculate total fare
      updates.passengers = numberOfPassengers;
      updates.passengerNames = newPassengerNames;
      updates.ages = newAges;
      updates.totalFare = calculateTotalFare(newAges, fare);
    } else if (name.startsWith('passengerName_')) {
      const index = parseInt(name.split('_')[1]);
      const newPassengerNames = [...formData.passengerNames];
      newPassengerNames[index] = value;

      updates.passengerNames = newPassengerNames;
    } else if (name.startsWith('age_')) {
      const index = parseInt(name.split('_')[1]);
      const newAges = [...formData.ages];
      newAges[index] = value;
      const fare = selectedBus ? selectedBus.fare : 0;

      // Recalculate total fare
      updates.ages = newAges;
      updates.totalFare = calculateTotalFare(newAges, fare);
    } else {
      updates[name] = value;
    }

    // Handle journey date separately for validation
    if (name === 'journeyDate') {
      const selectedDate = new Date(value);
      const options = { weekday: 'short' };
      const dayOfWeek = selectedDate.toLocaleString('en-US', options);

      // Check if the selected bus runs on that day
      if (selectedBus && !selectedBus.days.includes(dayOfWeek)) {
        alert(`The selected bus does not operate on ${dayOfWeek}. Please choose a different date.`);
        updates.journeyDate = ''; // Resetting the date field
      } else {
        updates.journeyDate = value; // Only set the date if valid
      }
    } else {
      updates[name] = value; // Set other input values
    }

    // Update state once
    setFormData(prevState => ({
      ...prevState,
      ...updates, // Merge all updates in one go
    }));
  };

  const validateFormData = () => {
    const { passengers, passengerNames, ages, email, phone } = formData;

    // Validate each passenger's name and age
    for (let i = 0; i < passengers; i++) {
      const passengerName = passengerNames[i];
      if (!/^[A-Za-z\s]+$/.test(passengerName)) {
        alert(`Passenger name ${i + 1} should contain only alphabets.`);
        return false;
      }
      const age = ages[i];
      if (age < 1 || age > 110) {
        alert(`Passenger age ${i + 1} should be between 1 and 110.`);
        return false;
      }
    }

    if (!/^\d{10}$/.test(phone)) {
      alert('Phone number should contain 10 digits. No spaces. No special characters');
      return false;
    }

    if (passengers < 1 || passengers > 15) {
      alert('Number of passengers should be between 1 and 15.');
      return false;
    }

    const storedEmail = localStorage.getItem('email');
    if (storedEmail && storedEmail !== email) {
      alert('Email should match the registered email.');
      return false;
    }

    return true;
  };

  const calculateTotalFare = (ages, fare) => {
    let total = 0;
    ages.forEach(age => {
      const parsedAge = parseInt(age); // Ensure age is parsed as an integer
      if (parsedAge < 5) {
        total += fare / 2; // Half fare for passengers under 5
      } else {
        total += fare; // Full fare for others
      }
    });
    return total;
  };


  const handleBookNow = (bus) => {
    if (!isLogin) {
      const confirmLogin = window.confirm('You need to log in to book a ticket. Do you want to log in now?');
      if (confirmLogin) {
        localStorage.setItem("redirectPath", '/bus-list');
        navigate('/login');
      }
    } else {
      setFormData(initialFormData); // Resetting form data here

      setSelectedBus(bus);
      const initialTotalFare = bus.fare; // Get fare from selected bus
      setFormData(prevState => ({
        ...prevState,
        totalFare: initialTotalFare // Set initial totalFare based on selected bus
      }));

      setShowModal(true);

    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateFormData()) return;

    const { ages } = formData;
    const fare = selectedBus ? selectedBus.fare : 0;

    // Final fare calculation before submission
    const totalFare = calculateTotalFare(ages, fare);


    alert(`Total Fare: Rs.${totalFare}`);
    setShowModal(false);

    setShowConfirmModal(true);
  };

  let cashfree;

  let initializeSDK = async function () {
    cashfree = await load({
      mode: "sandbox",
    })
  }

  initializeSDK();

  const [ticketId, setTicketId] = useState('');

  const getSessionId = async (totalFare, passengerNames, email, phone) => {
    try {
      let res = await axios.post("api/v1/ticket/payment", {
        totalFare,
        passengerNames,
        email,
        phone,
      });
      if (res && res.data.payment_session_id) {
        setTicketId(res.data.order_id);
        console.log(ticketId)
        return res.data.payment_session_id;
      }
    } catch (error) {
      console.log(error);
    }
  };


  const verifyPayment = async () => {
    try {
      let res = await axios.post("api/v1/ticket/verify", {
        ticketId: ticketId,
      })
      if (res && res.data) {
        alert("Payment verified.");
        const ticketData = {
          ticketId: ticketId,
          busId: selectedBus.busId, // Assuming selectedBus contains busId
          source,
          destination,
          type: selectedBus.type, // Assuming type is part of selectedBus
          totalFare: formData.totalFare,
          journeyDate: formData.journeyDate,
          passengerNames: formData.passengerNames,
          ages: formData.ages,
          email: formData.email,
          phone: formData.phone,
          paymentStatus: 'Completed', // Set to 'Completed' after successful payment
        };

        // Save ticket data
        const saveResponse = await axios.post("api/v1/ticket/save", ticketData);

        if (saveResponse.data.success) {
          alert("Ticket booked successfully. To view ticket go to 'My Bookings'.");
          // Optionally redirect or update UI after saving
        } else {
          alert("Failed to save ticket: " + saveResponse.data.message);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    try {
      const totalFare = formData.totalFare;
      const passengerNames = formData.passengerNames;
      const email = formData.email; // Get email from formData
      const phone = formData.phone; // Get phone from formData
      let response = await axios.post("api/v1/ticket/payment", {
        totalFare,
        passengerNames,
        email,
        phone,
      });
      console.log("Payment response:", response.data); // Log response data
      let sessionId = await getSessionId(totalFare, passengerNames, email, phone);
      console.log("Session ID:", sessionId);

      let checkoutOptions = {
        paymentSessionId: sessionId,
        redirectTarget: "_modal",
      };
      console.log(checkoutOptions)

      cashfree.checkout(checkoutOptions).then(async (res) => {
        await verifyPayment(ticketId);
        setShowConfirmModal(false);
      })
    } catch (error) {
      console.log(error);
    }
  };
  const source = localStorage.getItem('source');
  const destination = localStorage.getItem('destination');
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="container vh-100">
      <h1 className="text-center text-white text-uppercase my-4">Available Buses</h1>

      {buses.length === 0 ? (
        <div className="alert alert-danger text-center">
          No buses match the entered criteria. Try a different type of bus or day.
        </div>
      ) : (
        <div className="row justify-content-center">
          {buses.map(bus => (
            <div key={bus._id} className="col-md-4 col-sm-6 m-2">
              <div className="bg-white d-flex flex-column shadow p-3">
                <h4 className="text-dark fw-bold">{bus.busId}</h4>
                <p className="text-info h5 fw-bolder">
                  {bus.route?.source} to {bus.route?.destination}
                </p>
                <p className="text-black fw-bold">
                  Departure: {bus.departureTime} | Arrival: {bus.arrivalTime}
                </p>
                <p className="text-black fw-bold">
                  Type: {bus.type} | Available Seats: {bus.seatsAvailable}
                </p>
                <p className="text-black fw-bold">
                  Runs on: {bus.days.join(', ')} | Fare: Rs.{bus.fare}

                </p>
                <button
                  type="button"
                  className="btn mt-3 btn-dark mt-3 rounded-5 w-50"
                  onClick={() => handleBookNow(bus)}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedBus && (
        <div className={`buslist-modal-overlay ${showModal ? 'active' : ''}`}>
          <div className="buslist-modal-container">
            <div className="buslist-modal-header">
              <h5>Book Ticket for {selectedBus.busId}</h5>
              <button className="buslist-close-button" onClick={() => {
                setFormData(initialFormData);
                setShowModal(false);
              }}>&times;</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="buslist-form-group">
                  <label htmlFor="passengers">Number of Passengers</label>
                  <input
                    type="number"
                    id="passengers"
                    name="passengers"
                    value={formData.passengers}
                    onChange={(e) => {
                      const value = Math.min(15, Math.max(1, e.target.value)); // Ensure value stays within 1 to 15
                      handleChange({ target: { name: 'passengers', value } }); // Call handleChange with the constrained value
                    }} min="1"
                    max="15" // Added max limit
                    required
                  />
                </div>

                {/* Dynamically generate input fields for each passenger's name and age */}
                {Array.from({ length: formData.passengers }).map((_, i) => (
                  <div key={i} className="buslist-form-group">
                    <label htmlFor={`passengerName_${i}`}>Passenger Name {i + 1}</label>
                    <input
                      type="text"
                      id={`passengerName_${i}`}
                      name={`passengerName_${i}`}
                      value={formData.passengerNames[i] || ''}
                      onChange={handleChange}
                      placeholder={`Name Surname of Passenger ${i + 1}`}
                      required
                    />
                    <label htmlFor={`age_${i}`}>Passenger Age {i + 1}</label>
                    <input
                      type="number"
                      id={`age_${i}`}
                      name={`age_${i}`}
                      value={formData.ages[i] || ''}
                      onChange={(e) => {
                        // Allow the input to change normally
                        handleChange({ target: { name: `age_${i}`, value: e.target.value } });
                      }}
                      onBlur={(e) => {
                        // Validate age when input loses focus
                        const value = e.target.value;
                        if (formData.passengers === 1 && value < 12) {
                          alert("Age cannot be less than 12 for a single passenger.");
                          e.target.value = ''; // Optionally reset the input or handle it differently
                        }
                      }} placeholder={`Age of Passenger ${i + 1}`}
                      min="1"
                      max="110"
                      required
                    />
                  </div>
                ))}
                <div className="buslist-form-group">
                  <label>Fare:</label>
                  <input
                    type="number"
                    name="totalFare"
                    value={formData.totalFare} // Use totalFare from state
                    readOnly
                  />
                </div>

                <div className="buslist-form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                  />
                </div>
                <div className="buslist-form-group">
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone"
                    required
                  />
                </div>
                <div className="buslist-form-group">
                  <label htmlFor="journeyDate">Journey Date</label>
                  <input
                    type="date"
                    id="journeyDate"
                    name="journeyDate"
                    value={formData.journeyDate}
                    onChange={handleChange}
                    min={today}
                    required
                  />
                </div>
                <div className="text-center">
                  <button type="submit" className="btn btn-dark mt-3 rounded-5 w-50">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Confirm Payment Modal */}
      {showConfirmModal && (
        <div className="buslist-modal-overlay active">
          <div className="buslist-modal-container">
            <div className="buslist-modal-header">
              <h5>Confirm Booking Details</h5>
              <button className="buslist-close-button" onClick={() => setShowConfirmModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <p><strong>Bus:</strong> {selectedBus?.busId}</p>
              <p><strong>Source:</strong> {source}</p>
              <p><strong>Destination:</strong> {destination}</p>
              <p><strong>Type:</strong> {selectedBus?.type}</p>
              <p><strong>Total Fare:</strong> {formData?.totalFare}</p>
              <p><strong>Journey Date:</strong> {formData.journeyDate}</p>
              <p><strong>Passengers:</strong> {formData.passengerNames.map((name, index) => (
                <span key={index}>{name} (Age: {formData.ages[index]}), </span>
              ))}</p>
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Phone:</strong> {formData.phone}</p>

              <button className="btn btn-success" onClick={handleConfirmBooking}>
                Confirm and Pay
              </button>
              <button className="btn btn-danger ms-2" onClick={() => setShowConfirmModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusList;
