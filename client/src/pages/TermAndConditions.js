import React from 'react';
import { useSelector } from 'react-redux';

const TermsAndConditions = () => {
  const darkMode = useSelector(state => state.auth.darkMode);

  return (
    <div className="container py-4 mb-4">
          <h1 className="mb-4 text-center text-uppercase text-white">Terms and Conditions</h1>
      <div className="row justify-content-center">
        <div className={`col-md-6  ${darkMode ? 'bg-black text-white' : 'bg-white text-dark'} p-5`}>
          <ul className="list">
            <li className='mb-3'>
              Welcome to Gujarat Intercity Buses! These Terms and Conditions govern your use of our website located at gjintercitybuses.com.
            </li>
            <li className='mb-3'>
              Our Privacy Policy also governs your use of our Service and explains how we collect, safeguard, and disclose information that results from your use of our web pages.
            </li>
            <li className='mb-3'>
              All bookings made through our Service are subject to availability and acceptance by us. The booking is confirmed when you receive a confirmation email with your booking details. We reserve the right to refuse any booking without providing a reason.
            </li>
            <li className='mb-3'>
              Payments must be made at the time of booking. We accept payments via RazorPay. We are not responsible for any payment failures or issues caused by third-party payment processors.
            </li>
            <li className='mb-3'>
              Cancellations can be made up to 36 hours before the scheduled departure. Cancellations made within this period will be eligible for a refund as per our refund policy. Refunds will be processed within the working days. We reserve the right to charge a cancellation fee.
            </li>
            <li className='mb-3'>
              Users are expected to behave in a respectful and lawful manner while using the Service. Any form of abusive, threatening, or illegal conduct will not be tolerated and may result in the termination of your account.
            </li>
            <li className='mb-3'>
              To the maximum extent permitted by law, we are not liable for any direct, indirect, incidental, or consequential damages arising from the use of the Service. This includes, but is not limited to, damages for loss of profits, data, or other intangible losses.
            </li>
            <li className='mb-3'>
              We reserve the right to modify or replace these Terms at any time. The most current version of the Terms will be posted on the website. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.
            </li>
            <li className='mb-3'>
              These Terms are governed by the laws of India. Any disputes arising from these Terms will be subject to the exclusive jurisdiction of the courts of India.
            </li>
            <li className='mb-3'>
              If you have any questions about these Terms, please contact us at queries@gjintercitybuses.com
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
