import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  const darkMode = useSelector(state => state.auth.darkMode);
  const navigate = useNavigate();
  const role = useSelector((state) => state.auth.role);

  useEffect(() => {
    if (role !== 'admin') {
      navigate('/');
    }
  }, [role, navigate]);
  return (

    <div className="container-fluid">
      <div className="row">
        {/* Sidebar for larger screens */}
        <nav className={`col-md-2 d-md-block ${darkMode ? 'bg-black bg-gradient' : 'bg-light bg-gradient text-black'} sidebar sticky-top`}>
          <div className="sidebar-sticky">
            <div className="accordion shadow" id="sidebarAccordion">
              {/* Dashboard Section */}
              <div className="accordion-item">
                <h2 className="accordion-header" id="headingDashboard">
                  <button
                    className="button fs-6 ms-3 py-2 border-0 bg-transparent"

                  >
                    <i className="fa-solid fa-house-user me-1"></i><a className="text-decoration-none" href="/admin/dashboard">Dashboard</a>
                  </button>
                </h2>
                <div
                  id="collapseDashboard"
                  className="accordion-collapse collapse show"
                  aria-labelledby="headingDashboard"
                  data-bs-parent="#sidebarAccordion"
                >

                </div>
              </div>

              {/* Users Section */}
              <div className="accordion-item">
                <h2 className="accordion-header" id="headingUsers">
                  <button
                    className="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseUsers"
                    aria-expanded="false"
                    aria-controls="collapseUsers"
                  >
                    <i className="fa-solid fa-users me-1"></i> Users
                  </button>
                </h2>
                <div
                  id="collapseUsers"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingUsers"
                  data-bs-parent="#sidebarAccordion"
                >
                  <div className="accordion-body">
                    <ul className="nav flex-column">
                      <li className="nav-item"><a className="nav-link" href="/admin/all-users">View Users</a></li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Bookings Section */}
              <div className="accordion-item">
                <h2 className="accordion-header" id="headingBookings">
                  <button
                    className="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseBookings"
                    aria-expanded="false"
                    aria-controls="collapseBookings"
                  >
                    <i className="fa-solid fa-clipboard-list me-1"></i> Bookings
                  </button>
                </h2>
                <div
                  id="collapseBookings"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingBookings"
                  data-bs-parent="#sidebarAccordion"
                >
                  <div className="accordion-body">
                    <ul className="nav flex-column">
                      <li className="nav-item"><a className="nav-link" href="/admin/all-bookings">View Bookings</a></li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Buses Section */}
              <div className="accordion-item">
                <h2 className="accordion-header" id="headingBuses">
                  <button
                    className="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseBuses"
                    aria-expanded="false"
                    aria-controls="collapseBuses"
                  >
                    <i className="fa-solid fa-bus me-1"></i> Buses
                  </button>
                </h2>
                <div
                  id="collapseBuses"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingBuses"
                  data-bs-parent="#sidebarAccordion"
                >
                  <div className="accordion-body">
                    <ul className="nav flex-column">
                      <li className="nav-item"><a className="nav-link" href="/admin/all-buses">View Buses</a></li>
                      <li className="nav-item"><a className="nav-link" href="/admin/add-bus">Add Bus</a></li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Routes Section */}
              <div className="accordion-item">
                <h2 className="accordion-header" id="headingRoutes">
                  <button
                    className="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseRoutes"
                    aria-expanded="false"
                    aria-controls="collapseRoutes"
                  >
                    <i className="fa-solid fa-route me-1"></i> Routes
                  </button>
                </h2>
                <div
                  id="collapseRoutes"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingRoutes"
                  data-bs-parent="#sidebarAccordion"
                >
                  <div className="accordion-body">
                    <ul className="nav flex-column">
                      <li className="nav-item"><a className="nav-link" href="/admin/all-routes">View Routes</a></li>
                      <li className="nav-item"><a className="nav-link" href="/admin/add-route">Add Route</a></li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Feedback Section */}
              <div className="accordion-item">
                <h2 className="accordion-header" id="headingFeedback">
                  <button
                    className="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseFeedback"
                    aria-expanded="false"
                    aria-controls="collapseFeedback"
                  >
                    <i className="fa-solid fa-message me-1"></i> Feedbacks
                  </button>
                </h2>
                <div
                  id="collapseFeedback"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingFeedback"
                  data-bs-parent="#sidebarAccordion"
                >
                  <div className="accordion-body">
                    <ul className="nav flex-column">
                      <li className="nav-item"><a className="nav-link" href="/admin/all-feedbacks">View Feedback</a></li>
                    </ul>
                  </div>
                </div>
              </div>
              {/* Notifications Section */}
              <div className="accordion-item">
                <h2 className="accordion-header" id="headingNotification">
                  <button
                    className="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseNotification"
                    aria-expanded="false"
                    aria-controls="collapseNotification"
                  >
                    <i className="fa-solid fa-bell me-1"></i> Notifications
                  </button>
                </h2>
                <div
                  id="collapseNotification"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingNotification"
                  data-bs-parent="#sidebarAccordion"
                >
                  <div className="accordion-body">
                    <ul className="nav flex-column">
                      <li className="nav-item"><a className="nav-link" href="/admin/all-notifications">View Notifications</a></li>
                      <li className="nav-item"><a className="nav-link" href="/admin/add-notification">Add Notifications</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main content */}
        <main className="col-md-9 ml-sm-auto col-lg-10 px-4">
          {children}
        </main>
        {/* 
        <nav className="d-md-none fixed-bottom bg-white">
          <div className="container">
            <ul className="nav justify-content-around">
              <li className="nav-item text-center">
                <a className="nav-link" href="/">
                  <i className="fa-solid fa-house-user"></i>
                  <div>Dashboard</div>
                </a>
              </li>
              <li className="nav-item text-center">
                <a className="nav-link" href="/">
                  <i className="fa-solid fa-users"></i>
                  <div>Users</div>
                </a>
              </li>
              <li className="nav-item text-center">
                <a className="nav-link" href="/">
                  <i className="fa-solid fa-clipboard-list"></i>
                  <div>Bookings</div>
                </a>
              </li>
              <li className="nav-item text-center">
                <a className="nav-link" href="/">
                  <i className="fa-solid fa-bus"></i>
                  <div>Buses</div>
                </a>
              </li>
              <li className="nav-item text-center">
                <a className="nav-link" href="/">
                  <i className="fa-solid fa-route"></i>
                  <div>Routes</div>
                </a>
              </li>
              <li className="nav-item text-center">
                <a className="nav-link" href="/">
                  <i className="fa-solid fa-message"></i>
                  <div>Feedback</div>
                </a>
              </li>
            </ul>
          </div>
        </nav> */}
      </div>
    </div>
  );
};

export default AdminLayout;
