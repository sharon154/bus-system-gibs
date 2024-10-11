import React from 'react'
import { useSelector } from 'react-redux';

const PrivacyPolicy = () => {
  const darkMode = useSelector(state => state.auth.darkMode);

  return (
    <>
      <div className="container py-4 mb-4">
        <h1 className="mb-4 text-center text-uppercase text-white">Privacy Policy</h1>
        <div className="row justify-content-center">
          <div className={`col-md-6  ${darkMode ? 'bg-black text-white' : 'bg-white text-dark'} p-5`}>
            <ul className="list">
              <li className='mb-3'>
                We respect your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, disclose, and protect your information when you use our bus booking website.
              </li>

              <li className='mb-3'>When you book a ticket, create an account, or contact us, we may collect personal information such as your name, email address, phone number, payment details, and travel preferences.
              </li>
              <li className='mb-3'>We may also collect non-personal information such as your IP address, browser type, and device information for analytical purposes.
              </li>

              <li className='mb-3'>We use your information to process your booking, send confirmation emails, and provide customer support.</li>
              <li className='mb-3'>We may use your contact information to send you promotional offers, newsletters, or important updates related to your bookings. You can opt out of these communications at any time.</li>
              <li className='mb-3'>We analyze your information to improve our services and user experience.</li>
              <li className='mb-3'>We may use your information to comply with legal requirements or to protect our rights and interests.</li>

              <li className='mb-3'>We may share your information with trusted third-party service providers who assist us in operating our website and business, such as payment processors and email marketing platforms. These third parties are contractually obligated to protect your information.
              </li>

              <li className='mb-3'>We implement security measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. However, no method of transmission or storage is completely secure, and we cannot guarantee absolute security.</li>

              <li className='mb-3'>You have the right to access, rectify, or delete your personal information. You can also request to restrict or object to the processing of your information.
              </li>
              <li className='mb-3'>We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on our website.</li>

              <li className='mb-3'>If you have any questions about this Privacy Policy, please contact us at privacy@example.com</li>

            </ul>
          </div>
        </div>
      </div >

    </>
  )
}

export default PrivacyPolicy
