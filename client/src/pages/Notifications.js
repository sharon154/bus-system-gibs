import React, { useState, useEffect } from 'react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // State to track the active tab

  useEffect(() => {
    const storedNotifications = JSON.parse(localStorage.getItem('notifications')) || [];
    setNotifications(storedNotifications);
  }, []);

  const getPriorityStyle = (priority) => {
    const baseStyle = {
      backgroundColor: '#ffffff', // Semi-transparent white
      color: '#0000FF',
      borderRadius: '8px', // Add border radius here
      padding: '10px',
      fontSize: '20px', // Increase font size
      textAlign: 'left', // Align text to the left
      width: '100%', // Make it full width of the parent
      maxWidth: '500px', // Optional: Set a maximum width for the notifications
    };

    switch (priority) {
      case 'high':
        return { ...baseStyle, color: '#FF0000' };
      case 'medium':
        return { ...baseStyle, color: '#FF6F20' };
      case 'low':
        return { ...baseStyle, color: '#FFA500' };
      default:
        return baseStyle; // Default case
    }
  };

  // Filter notifications based on the active tab
  const filteredNotifications = activeTab === 'all'
    ? notifications
    : notifications.filter((notification) => notification.priority === activeTab);

  return (
    <div className="container py-4 my-5">
      <h1 className="mb-4 text-center text-uppercase text-white">Notifications</h1>

      {/* Tabs for different priorities */}
      <div className="d-flex justify-content-center mb-4">
        {['all', 'high', 'medium', 'low', 'general'].map((tab) => (
          <button
            key={tab}
            className="btn mx-2 rounded-5" // Adds the rounded-5 class
            style={{
              backgroundColor: activeTab === tab ? '#007bff' : '#f1f1f1',
              color: activeTab === tab ? 'white' : 'black',
            }}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} Priority
          </button>
        ))}
      </div>

      {/* Display the filtered notifications */}
      {filteredNotifications.length > 0 ? (
        <div className="d-flex flex-column align-items-center"> {/* Changed to flex-column */}
          {filteredNotifications.map((notification, index) => (
            <div key={index} className="p-2 my-2" style={getPriorityStyle(notification.priority)}>
              <div className="d-flex align-items-center"> {/* Flexbox container for icon and text */}
                <i className="fa-solid fa-circle-exclamation me-2" style={{ fontSize: '24px' }}></i> {/* Increased icon size and added margin */}
                <span className="mb-0" style={{ fontSize: '18px' }}>{notification.message}</span> {/* Increased font size of the message */}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-white">No notifications available for this priority.</p>
      )}
    </div>
  );
};

export default Notifications;
