import React, { useState, useEffect, useRef } from 'react';

const Chatbot = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [userInput, setUserInput] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const chatHistoryRef = useRef(null);

    // Define refs for audio files
    const sendSoundRef = useRef(null);
    const clickSoundRef = useRef(null);

    const toggleChatbot = () => {
        setIsVisible(!isVisible);
        if (clickSoundRef.current) {
            clickSoundRef.current.play();  // Play click sound when toggling chatbot visibility
        }
    };

    const handleSend = () => {
        if (userInput.trim() === '') {
            return; // Ignore empty input
        }

        const userMessage = userInput;
        const response = getFAQResponse(userInput);

        // Update chat history with user message and bot response
        setChatHistory(prevHistory => [
            ...prevHistory,
            { user: userMessage, bot: response }
        ]);

        if (sendSoundRef.current) {
            sendSoundRef.current.play();  // Play send sound when message is sent
        }

        setUserInput(''); // Clear the input field after sending the message
    };

    const handleUserInput = (e) => {
        setUserInput(e.target.value);
    };

    const getFAQResponse = (input) => {
        const faqData = {
            greetings: [
                { question: "hi", answer: "Hello! How can I assist you today?" },
                { question: "hello", answer: "Hi there! How can I help you?" },
                { question: "how are you", answer: "I'm just a bot, but thanks for asking! How can I assist you today?" },
            ],
            services: [
                { question: "bus schedule", answer: "Click on Services and you will find the bus schedule option." },
                { question: "track bus", answer: "Click on Services and you will find the Track Bus option." },
                { question: "book ticket", answer: "Click Services > Book Ticket." },
                { question: "cancel ticket", answer: "Click Services > Cancel Ticket." },
            ],
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
            // ... other categories
        };

        // Check for matches in the FAQ data
        for (let category in faqData) {
            const matchedFaq = faqData[category].find(faq => input.toLowerCase().includes(faq.question.toLowerCase()));
            if (matchedFaq) {
                // Removed the sound playing line
                return matchedFaq.answer;
            }
        }
        return "I'm sorry, I don't understand.";
    };

    useEffect(() => {
        if (chatHistoryRef.current) {
            chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight; // Auto-scroll to the bottom of the chat history
        }
    }, [chatHistory]);

    return (
        <>
            {/* Audio elements with sound refs */}
            <audio ref={sendSoundRef} src="/audio/send.mp3" />
            
            <audio ref={clickSoundRef} src="/audio/click.mp3" />

            <style>
                {`
                    #chatbot-container {
                        position: fixed;
                        bottom: 150px; 
                        right: 30px;
                        z-index: 1000;
                        background-color: #fff;
                        border-radius: 10px;
                        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
                        max-width: 400px; 
                        transition: all 0.3s ease;
                    }

                    .chat-header {
                        background-color: #007bff;
                        color: white;
                        padding: 10px;
                        text-align: center;
                        font-weight: bold;
                        cursor: pointer;
                    }

                    .chat-history {
                        max-height: 300px;
                        overflow-y: auto;
                        padding: 10px;
                    }

                    .user-message {
                        text-align: right;
                        margin: 5px;
                    }

                    .bot-message {
                        text-align: left;
                        margin: 5px;
                    }

                    .input-container {
                        display: flex;
                        margin: 10px;
                    }

                    .input-container input {
                        flex: 1;
                        padding: 10px;
                        border-radius: 5px;
                        border: 1px solid #ccc;
                    }

                    .input-container button {
                        padding: 10px 15px;
                        border: none;
                        border-radius: 5px;
                        background-color: #007bff;
                        color: white;
                        cursor: pointer;
                        margin-left: 5px;
                    }

                    .toggle-button {
                        padding: 5px 10px;
                        border: none;
                        border-radius: 5px;
                        color: white;
                        cursor: pointer;
                        margin: 5px;
                    }

                    .minimize-button {
                        background-color: gray;
                    }

                    .close-button {
                        background-color: red;
                    }

                    #chat-button {
                        position: fixed;
                        bottom: 20px;
                        right: 20px;
                        background: transparent;
                        border: none;
                        cursor: pointer;
                        z-index: 1001;
                    }

                    #chat-button img {
                        width: 60px;
                        height: 60px;
                        transition: transform 0.2s;
                    }

                    #chat-button img:hover {
                        transform: scale(1.1);
                    }
                `}
            </style>

            {isVisible && (
                <div id="chatbot-container">
                    <div className="chat-header" onClick={toggleChatbot}>Aaron</div>
                    <div className="chat-history" ref={chatHistoryRef}>
                        {chatHistory.map((msg, index) => (
                            <div key={index} className="chat-message">
                                <div className={`user-message`}>
                                    <strong>You: </strong>{msg.user}
                                </div>
                                <div className={`bot-message`}>
                                    <strong>Aaron: </strong>{msg.bot}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="input-container">
                        <input 
                            type="text" 
                            value={userInput} 
                            onChange={handleUserInput} 
                            placeholder="Type your message..."
                        />
                        <button onClick={handleSend}>Send</button>
                    </div>
                    <div>
                        <button className="toggle-button minimize-button" onClick={toggleChatbot}>Minimize</button>
                        <button className="toggle-button close-button" onClick={() => setIsVisible(false)}>Close</button>
                    </div>
                </div>
            )}

            <button id="chat-button" aria-label="Toggle Chatbot" onClick={toggleChatbot}>
                <img src="/images/cb.png" alt="Chatbot" />
            </button>
        </>
    );
};

export default Chatbot;
