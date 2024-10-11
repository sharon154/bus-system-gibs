import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { authActions } from "../redux/store";
import busLogo from '../images/rosh.png'; // Import the image

const Header = () => {
    const isLogin = useSelector(state => state.auth.isLogin);
    const darkMode = useSelector(state => state.auth.darkMode);
    // const role = useSelector((state) => state.auth.role);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");

    const toggleDarkMode = () => {
        dispatch(authActions.toggleDarkMode());
    };

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to log out?")) {
          // User clicked "OK"
          dispatch(authActions.logout());  // Logout only if the user confirms
          localStorage.removeItem("username");  // Remove username from localStorage
          alert("Logged out successfully");
          navigate('/login');  // Redirect to login
        }
      };
      

    return (
        <div>
            <nav className={`navbar navbar-expand-lg ${darkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-white'} fs-6`}>
                <div className="container-fluid mx-3 d-flex flex-wrap">
                {isLogin && role === 'admin' ? (
                    <Link className={`navbar-brand ${darkMode ? 'text-white' : 'text-dark'}`} to="/admin/dashboard">
                    <img src={busLogo} alt="Bus Logo" style={{ height: '70px' }} /> Gujarat Intercity Buses
                </Link>
                ):(<Link className={`navbar-brand ${darkMode ? 'text-white' : 'text-dark'}`} to="/">
                    <img src={busLogo} alt="Bus Logo" style={{ height: '70px' }} /> Gujarat Intercity Buses
                </Link>)}
                    
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            {/* Dark Mode Toggle */}
                            <li className="nav-item mx-2">
                                <button onClick={toggleDarkMode} className="btn btn-link">
                                    {darkMode ? <i className="fa-solid fa-sun fa-2x text-white"></i> : <i className="fa-solid fa-moon fa-2x text-dark"></i>}
                                </button>
                            </li>
                            {isLogin && role === 'admin' ? (
                                <>
                                    <li className="nav-item mx-2">
                                        <span className="nav-link active">Welcome Admin, {username}!</span>
                                    </li>
                                    <li className="nav-item mx-2">
                                        <Link className="nav-link" to="/admin/dashboard">Home</Link>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="nav-item mx-2">
                                        <Link className="nav-link active" to="/">Home</Link>
                                    </li>
                                    <li className="nav-item mx-2">
                                        <Link className="nav-link" to="/about-us">About Us</Link>
                                    </li>
                                    <li className="nav-item dropdown mx-2">
                                        <a className="nav-link dropdown-toggle" href="/" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            Services
                                        </a>
                                        <ul className="dropdown-menu">
                                            <li><a className="dropdown-item" href="/">Book Ticket</a></li>
                                            <li><a className="dropdown-item" href="/schedule">Bus Schedule</a></li>
                                            <li><a className="dropdown-item" href="/track-bus">Track Your Bus</a></li>
                                            <li><a className="dropdown-item" href="/cancel-ticket">Cancel Ticket</a></li>
                                            <li><a className="dropdown-item" href="/feedback">Feedback</a></li>
                                        </ul>
                                    </li>
                                    <li className="nav-item mx-2">
                                        <Link className="nav-link" to="/notifications">Notifications</Link>
                                    </li>
                                    <li className="nav-item mx-2">
                                        <a className="nav-link" href="#contact-us">Contact Us</a>
                                    </li>
                                </>
                            )}


                            {!isLogin ? (
                                <>
                                    <li className="nav-item mx-2">
                                        <Link className="nav-link" to="/login">Login</Link>
                                    </li>
                                    <li className="nav-item mx-2">
                                        <Link className="nav-link" to="/login-admin"><i className="fa-solid fa-user-tie me-1"></i>Admin</Link>
                                    </li>
                                </>
                            ) : (
                                <>
                                    {/* User Dropdown */}
                                    <li className="nav-item dropdown mx-2">
                                        <button className="btn btn-link dropdown-toggle d-flex align-items-center text-decoration-none text-dark" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                            {darkMode ? (
                                                <>
                                                    <i className="fa-solid fa-user-circle fa-2x text-white me-1"></i>
                                                    <span className="text-white">{username}</span> {/* White text for dark mode */}
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fa-solid fa-user-circle fa-2x text-dark me-1"></i>
                                                    <span className="text-dark">{username}</span> {/* Dark text for light mode */}
                                                </>
                                            )}

                                        </button>
                                        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                                            {role === 'user' && (
                                                <>
                                                    <li><Link className="dropdown-item" to="/my-bookings">My Bookings</Link></li>

                                                </>
                                            )}
                                            <li>
                                                <button onClick={handleLogout} className="dropdown-item">Logout</button>
                                            </li>
                                        </ul>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
        </div>

    )
}

export default Header;
