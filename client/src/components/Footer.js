// Footer.js
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Footer = () => {
  const darkMode = useSelector(state => state.auth.darkMode);

  const [isPrivacyOpen, setPrivacyOpen] = useState(false);
  const [isTermsOpen, setTermsOpen] = useState(false);

  // Create refs for both modal bodies
  const termsModalBodyRef = useRef(null);
  const privacyModalBodyRef = useRef(null);

  const handlePrivacyOpen = () => {
    setPrivacyOpen(true);
    setTermsOpen(false); // Close Terms if Privacy is opened
  };

  const handleTermsOpen = () => {
    setTermsOpen(true);
    setPrivacyOpen(false); // Close Privacy if Terms is opened
  };

  const handleClose = () => {
    setPrivacyOpen(false);
    setTermsOpen(false);
  };

  // Scroll to top when the modal is opened
  useEffect(() => {
    if (isTermsOpen && termsModalBodyRef.current) {
      termsModalBodyRef.current.scrollTop = 0;
    } else if (isPrivacyOpen && privacyModalBodyRef.current) {
      privacyModalBodyRef.current.scrollTop = 0;
    }
  }, [isTermsOpen, isPrivacyOpen]);


  return (
    <footer id='contact-us' className={`${darkMode ? 'bg-dark text-white' : 'bg-white text-dark'} py-3`}>
      <div className="container">
        <div className="text-center mb-2">
          <span className="fs-6">For queries and complaints, mail us at <a href='mailto:queries@gjintercitybus.com' className='text-decoration-none'><i className="fa-solid fa-envelope"> </i> queries@gjintercitybus.com</a></span>
        </div>

        {/* Connect with us and social media icons */}
        <div className="d-flex align-items-center justify-content-center">
          <h6 className="me-3">Connect with us:</h6>
          <ul className="list-unstyled d-flex justify-content-center">
            <li className="me-3 fs-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <i className="fa-brands fa-facebook"></i>              </a>
            </li>

            <li className="me-3 fs-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <i className="fa-brands fa-instagram"></i>              </a>
            </li>
            <li className="me-3 fs-4">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <i className="fa-brands fa-linkedin"></i>              </a>
            </li>
          </ul>
        </div>
        {/* Links */}
        <div className="text-center">
          <ul className="list-unstyled d-flex justify-content-center fs-6">
            <li className="me-4"><button onClick={handleTermsOpen} className={`${darkMode ? 'text-white' : 'text-black'} text-decoration-none`} style={{ background: 'none', border: 'none' }}>
              Terms and Conditions
            </button></li>
            <li className="me-4"><button onClick={handlePrivacyOpen} className={`${darkMode ? 'text-white' : 'text-black'} text-decoration-none`} style={{ background: 'none', border: 'none' }}>
              Privacy Policy
            </button></li>
            <li className="me-4"><Link to="/faq" className={`${darkMode ? 'text-white' : 'text-black'} text-decoration-none`}>FAQ  </Link></li>
          </ul>
        </div>


        {/* Copyright */}
        <div className="text-center">
          <span className="fs-6">&copy; 2024 Gujarat Intercity Buses. All rights reserved.</span>
        </div>
      </div>
      {/* Privacy Policy Modal */}
      <div className={`popup-overlay ${isPrivacyOpen ? 'show' : ''}`} style={{ display: isPrivacyOpen ? 'flex' : 'none' }}>
        <div className="popup-content">
          <div className="popup-header">
            <h5 className="popup-title">Privacy Policy</h5>
          </div>
          <div className="popup-body" ref={privacyModalBodyRef}>
            <ul className="list">
              <li>We respect your privacy and are committed to protecting your personal information.</li>
              <li>When you book a ticket, create an account, or contact us, we may collect personal information such as your name, email address, phone number, payment details, and travel preferences.</li>
              <li>We may also collect non-personal information such as your IP address, browser type, and device information for analytical purposes.</li>
              <li>We use your information to process your booking, send confirmation emails, and provide customer support.</li>
              <li>We may use your contact information to send you promotional offers, newsletters, or important updates related to your bookings.</li>
              <li>You can opt out of these communications at any time.</li>
              <li>We analyze your information to improve our services and user experience.</li>
              <li>We may share your information with trusted third-party service providers.</li>
              <li>We implement security measures to protect your personal information.</li>
              <li>You have the right to access, rectify, or delete your personal information.</li>
              <li>We may update this Privacy Policy from time to time.</li>
              <li>If you have any questions about this Privacy Policy, please contact us at privacy@example.com.</li>
            </ul>
          </div>
          <button type="button" className="close-button" onClick={handleClose}>Close</button>
        </div>
      </div>

      {/* Terms and Conditions Modal */}
      <div className={`popup-overlay ${isTermsOpen ? 'show' : ''}`} style={{ display: isTermsOpen ? 'flex' : 'none' }}>
        <div className="popup-content">
          <div className="popup-header">
            <h5 className="popup-title">Terms and Conditions</h5>
          </div>
          <div className="popup-body" ref={termsModalBodyRef}>
            <ul className="list">
              <li>Welcome to Gujarat Intercity Buses! These Terms and Conditions govern your use of our website located at gjintercitybuses.com.</li>
              <li>Our Privacy Policy also governs your use of our Service and explains how we collect, safeguard, and disclose information that results from your use of our web pages.</li>
              <li>All bookings made through our Service are subject to availability and acceptance by us. The booking is confirmed when you receive a confirmation email with your booking details. We reserve the right to refuse any booking without providing a reason.</li>
              <li>Payments must be made at the time of booking. We accept payments via RazorPay. We are not responsible for any payment failures or issues caused by third-party payment processors.</li>
              <li>Cancellations can be made up to 36 hours before the scheduled departure. Cancellations made within this period will be eligible for a refund as per our refund policy. Refunds will be processed within the working days. We reserve the right to charge a cancellation fee.</li>
              <li>Users are expected to behave in a respectful and lawful manner while using the Service. Any form of abusive, threatening, or illegal conduct will not be tolerated and may result in the termination of your account.</li>
              <li>To the maximum extent permitted by law, we are not liable for any direct, indirect, incidental, or consequential damages arising from the use of the Service. This includes, but is not limited to, damages for loss of profits, data, or other intangible losses.</li>
              <li>We reserve the right to modify or replace these Terms at any time. The most current version of the Terms will be posted on the website. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.</li>
              <li>These Terms are governed by the laws of India. Any disputes arising from these Terms will be subject to the exclusive jurisdiction of the courts of India.</li>
              <li>If you have any questions about these Terms, please contact us at queries@gjintercitybuses.com.</li>
            </ul>
          </div>
          <button type="button" className="close-button" onClick={handleClose}>Close</button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
