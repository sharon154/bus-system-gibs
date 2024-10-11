import './App.css';
import React from 'react'; // Added useState and useEffect for future use
import Header from './components/Header';
import Chatbot from './components/Chatbot';
import { Routes, Route } from 'react-router-dom';
import Login from "./pages/Login";
import Register from "./pages/Register";
import SearchBus from './pages/SearchBus';
import AboutUs from './pages/AboutUs';
import AddBus from './pages/Admin/AddBus';
import Footer from './components/Footer';
import BusSchedule from './pages/BusSchedule';
import CancelTicket from './pages/CancelTicket';
import Feedback from './pages/Feedback';
import RealTimeTracking from './pages/RealTimeTracking';
// import TermsAndConditions from './pages/TermAndConditions';
// import PrivacyPolicy from './pages/PrivacyPolicy';
import Notifications from './pages/Notifications';
import AddRoute from './pages/Admin/AddRoute';
import Dashboard from './pages/Admin/Dashboard';
import BusList from './pages/BusList';
import ViewBuses from './pages/Admin/ViewBuses';
import ViewRoutes from './pages/Admin/ViewRoutes';
import ViewUsers from './pages/Admin/ViewUsers';
import ViewFeedbacks from './pages/Admin/ViewFeedbacks';
import ViewBookings from './pages/Admin/ViewBookings';
import ViewNotifications from './pages/Admin/ViewNotifications';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import EditBus from './pages/Admin/EditBus';
import FAQ from './pages/FAQ';
import EditRoute from './pages/Admin/EditRoute';
import AddNotification from './pages/Admin/AddNotification';
import AdminLogin from './pages/AdminLogin';
import MyBookings from './pages/MyBookings';
import EmailVerification from './pages/EmailVerification';


// ErrorBoundary component to catch errors in child components
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by Error Boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children; 
  }
}

function App() {
  return (
    <>
      <Header />
      <ErrorBoundary>

        <Routes>
          <Route path='/' element={<SearchBus />} />
          <Route path='/admin/dashboard' element={<Dashboard />} />
          <Route path='/admin/add-bus' element={<AddBus />} />
          <Route path='/bus-list' element={<BusList />} />
          <Route path='/admin/add-route' element={<AddRoute />} />
          <Route path='/login' element={<Login />} />
          <Route path='/login-admin' element={<AdminLogin />} />
          <Route path='/register' element={<Register />} />
          <Route path='/about-us' element={< AboutUs />} />
          <Route path='/cancel-ticket' element={< CancelTicket />} />
          <Route path='/track-bus' element={< RealTimeTracking />} />
          <Route path='/schedule' element={< BusSchedule />} />
          <Route path='/feedback' element={< Feedback />} />
          {/* <Route path='/terms-conditions' element={< TermsAndConditions />} />
        <Route path='/privacy-policy' element={< PrivacyPolicy />} /> */}
          <Route path='/faq' element={< FAQ />} />
          <Route path='/notifications' element={< Notifications />} />
          <Route path='/admin/all-buses' element={<ViewBuses />} />
          <Route path='/admin/all-routes' element={<ViewRoutes />} />
          <Route path='/admin/all-users' element={<ViewUsers />} />
          <Route path='/admin/all-feedbacks' element={<ViewFeedbacks />} />
          <Route path='/admin/all-bookings' element={<ViewBookings />} />
          <Route path='/admin/all-notifications' element={<ViewNotifications />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password/:token' element={<ResetPassword />} />
          <Route path="/admin/edit-bus/:busId" element={<EditBus />} /> 
          <Route path="/admin/edit-route/:routeId" element={<EditRoute />} /> 
          <Route path="/admin/add-notification" element={<AddNotification />} /> 
          <Route path="/my-bookings" element={<MyBookings />} /> 
          <Route path="/verify-email" element={<EmailVerification />} /> {/* Email verification route */}

        </Routes>
        </ErrorBoundary>

        <Chatbot />
        <Footer />
    </>
  );
}

export default App;
