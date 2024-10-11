// FAQ.js
import React, { useState, useEffect } from 'react';

const FAQ = () => {
    const [activeTab, setActiveTab] = useState('general');
    const [expanded, setExpanded] = useState(null); // Track a single expanded question

    const faqs = {
        general: [
            {
                question: "Can I track the location of my booked bus online?",
                answer: "Yes, you can track your booked bus in real-time using our tracking feature."
            },
            {
                question: "What are the advantages of purchasing a bus ticket with GIBS?",
                answer: "Purchasing a bus ticket with GIBS offers benefits such as easy booking, customer support, and exclusive discounts."
            },
            {
                question: "Why book bus tickets online on GIBS?",
                answer: "Booking online is convenient, fast, and allows you to compare options easily."
            },
            {
                question: "Do I need to create an account on the GIBS site to book my bus ticket?",
                answer: "Yes its mandatory to create an account for booking a ticket."
            },
            {
                question: "Does bus booking online cost me more?",
                answer: "No, online prices are competitive and often come with exclusive online discounts."
            },
            {
                question: "How can I get discounts on bus booking?",
                answer: "Discounts can be obtained through promotional codes, seasonal offers, and partnerships."
            },
            {
                question: "What's New in Bus Booking on GIBS?",
                answer: "We continually update our services to include new routes, partnerships, and features for a better user experience."
            },
    
        ],
        ticket: [
            {
                question: "How can I book bus tickets on GIBS?",
                answer: "Bus ticket booking is effortless on GIBS. To book tickets, go to the main page and enter your source city and destination city in the 'From' and 'To' fields, respectively. Enter the travel date and hit the search button. You will see the bus list available on the given route, and you can use filters to rearrange the list."
            },
            {
                question: "Can I change the date of my journey after I have booked my bus ticket?",
                answer: "Yes, you can change the journey date by clicking the 'Reschedule' icon if it is available for your bus operator."
            },
            {
                question: "Is it mandatory to take a printout of the ticket?",
                answer: "It depends on the bus operator. Some support mTickets, which can be shown on your mobile, while others require a printout of the e-ticket."
            },
            {
                question: "I've lost my ticket. What should I do now?",
                answer: "A copy of the bus ticket would have been emailed to you. Print that email and show it at boarding. If you haven’t received it, contact customer service for a resend."
            },
            {
                question: "What is an mTicket?",
                answer: "An mTicket is an SMS sent to your mobile upon booking with select operators. It contains the TIN and PNR numbers and can be used to board the bus."
            },
            {
                question: "I didn’t receive my mTicket. Can you resend it?",
                answer: "You can generate your mTicket online by clicking the Print/SMS ticket link on the GIBS homepage and entering your TIN number. If you lack the e-ticket, contact customer service."
            },
            {
                question: "I entered the wrong mobile number while booking. Can I get my mTicket on a different number?",
                answer: "Yes, you can receive the mTicket on a different number by contacting the GIBS call center."
            },
            {
                question: "What is the baggage policy?",
                answer: "Each passenger is allowed one carry-on and one checked bag."
            },
        ],
        payment: [
            {
                question: "What payment methods are accepted?",
                answer: "We accept credit cards, debit cards, and PayPal."
            },
            {
                question: "Is my payment secure?",
                answer: "Yes, all payments are processed through secure gateways."
            },
            {
                question: "Is it safe to use my credit or debit card to buy bus tickets on GIBS?",
                answer: "Transactions on GIBS are very safe. We employ the best-in-class security and the transactions done are secure. Apart from being certified by Verisign, GIBS uses Secure Socket Layers (SSL) data encryption."
            },
            {
                question: "Does the owner of the credit card/debit card with which the bus ticket is purchased need to be one of the passengers?",
                answer: "Not at all! A passenger can use any debit or credit card to pay for the bus ticket, not necessarily their own. However, the passenger in whose name the ticket is booked should carry proof of identity at the time of boarding."
            },
            {
                question: "What are the different payment options available on bus ticket booking?",
                answer: "There are many payment modes available to book buses on the GIBS website and app, including Debit Card/Credit Card/ATM Cards, Net Banking, UPI, Book Now Pay Later, and Wallets."
            },
            {
                question: "How does the transaction appear on my card/account statement?",
                answer: "Transactions on GIBS will appear as GIBS.IN, www.gibs.in in your bank statement."
            },
        ],
        'cancellation and refund': [
            {
                question: "Can I cancel my bus ticket online?",
                answer: "Yes, you can cancel bus tickets online. Most tickets can be canceled online, but some can only be canceled through customer support. Cancellation fees and periods may differ for specific services."
            },
            {
                question: "How can I cancel my bus ticket online?",
                answer: "To cancel the bus ticket online, you need to click on the cancellation link provided on our home page. Enter your ticket number and the e-mail ID that was provided at the time of bus booking and click on cancel ticket."
            },
            {
                question: "I missed the bus. Do I get a refund?",
                answer: "GIBS provides a 100% refund if the bus is missed due to either GIBS or its partner company's fault. However, if the bus is missed due to any other reason not directly related to GIBS, no refund is provided."
            },
            {
                question: "How can I get a refund in case I cancel my ticket?",
                answer: "The refund is provided as per the cancellation policy of the operator. The refund can be credited to the source of payment or credited to GIBS wallet, which can be used for future bookings."
            },
            {
                question: "What happens if the bus does not leave on time or is canceled?",
                answer: "If your bus does not leave on time or is canceled, you will need to consult the counter of the respective bus operators or call GIBS customer care for appropriate actions."
            },
        ],
        insurance: [
            {
                question: "What is travel insurance?",
                answer: "Travel insurance covers unexpected events during your trip."
            },
            {
                question: "Details on Insurance",
                answer: "For details on Insurance of your journey after bus ticket booking, please refer to the Insurance Terms."
            },
        ],
    };

    const toggleAnswer = (question) => {
        setExpanded(prev => (prev === question ? null : question)); // Collapse previously expanded question
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setExpanded(null); // Collapse all when switching tabs
    };

    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto', marginBottom: '20px', fontWeight: 'bolder' }}>
            <h1 style={{ textAlign: 'center', color: 'white', textTransform: 'uppercase', marginBottom: '20px' , marginTop: '20px'  }}>Frequently Asked Questions</h1>
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                {Object.keys(faqs).map(tab => (
                    <button
                        key={tab}
                        style={{
                            margin: '0 10px 0 10px',
                            padding: '10px',
                            cursor: 'pointer',
                            backgroundColor: activeTab === tab ? '#007bff' : '#f1f1f1',
                            color: activeTab === tab ? 'white' : 'black',
                            border: 'none',
                            borderRadius: '5px',
                        }}
                        onClick={() => handleTabChange(tab)}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>
            <div>
                {faqs[activeTab].map((faq, index) => (
                    <div 
                        key={index} 
                        style={{ 
                            marginBottom: '20px', 
                            backgroundColor: 'white', 
                            padding: '15px', 
                            borderRadius: '5px', 
                            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', 
                            cursor: 'pointer' // Make the entire question area clickable
                        }}
                        onClick={() => toggleAnswer(faq.question)} // Toggle on question click
                    >
                        <h3 style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            fontSize: '1em' 
                        }}>
                            {faq.question}
                            <span>
                                {expanded === faq.question ? '-' : '+'}
                            </span>
                        </h3>
                        {expanded === faq.question && <p style={{ fontSize: '0.8em' }}>{faq.answer}</p>} {/* Decreased font size for answers */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FAQ;
