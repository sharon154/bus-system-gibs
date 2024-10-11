import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { authActions } from "../redux/store";
import { useDispatch } from 'react-redux';

const AdminLogin = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // const role = useSelector((state) => state.auth.role);
    const [showPassword, setShowPassword] = useState(false); // State to manage password visibility

    // Function to toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
    };
    //state
    const [inputs, setInputs] = useState({
        email: '',
        password: ''
    })
    //handle change
    const handleChange = (e) => {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    }
    const isValidEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault()
        //console.log(inputs)

        let isValid = true;

        // Validate email
        if (!isValidEmail(inputs.email)) {
            setErrors(prev => ({ ...prev, email: "Please enter a valid email address." }));
            isValid = false;
        } else {
            setErrors(prev => ({ ...prev, email: "" }));
        }
        
        if (!isValid) return;
        try {
            const { data } = await axios.post("/api/v1/user/login", { email: inputs.email, password: inputs.password });

            if (data.success) {
                dispatch(authActions.login({ role: data.user.role })); // Set the role to user
                localStorage.setItem("username", data.user.username);
                localStorage.setItem("role", data.user.role);
                alert("Login successful");
                navigate('/admin/dashboard');
                //console.log('User role:', data.user.role); // Log the role for debugging
                // localStorage.setItem("role", data.user.role);
                // localStorage.setItem("token", data.token);
                // console.log('token', data.token);
                // console.log('role', data.user.role);

                
            }
        } catch (error) {
            // Handle different error messages from the backend
            if (error.response && error.response.status === 401) {

                if (error.response.data.message === "Email is not registered") {
                    setErrors(prev => ({ ...prev, login: "Email is not registered." }));
                } else if (error.response.data.message === "Invalid email or password") {
                    setErrors(prev => ({ ...prev, login: "Invalid email or password." }));
                }
            } else {
                console.log(error);
            }
        }
    }
    return (
        <div className='login-container'>

            <div className="container d-flex justify-content-center align-items-center vh-100">
                <div className="row w-100">
                    <div className="col-md-6 col-lg-4 mx-auto">
                    {errors.email && <div className="alert alert-danger">{errors.email}</div>}
                    {errors.login && <div className="alert alert-danger">{errors.login}</div>} 
                        <div className='card p-3 shadow'>
                            <div className="card-body">
                                <h1 className="card-title text-center mb-4 text-dark text-uppercase">Login</h1>
                                <form onSubmit={handleSubmit}>
                                    

                                    <div className="mb-3 d-flex align-items-center">
                                        <i className="fa-solid fa-envelope fa-2x text-dark me-3"></i>
                                        <input
                                            type="email"
                                            className="form-control rounded-5"
                                            id="email"
                                            name="email"
                                            value={inputs.email}
                                            onChange={handleChange}
                                            placeholder="Enter email"
                                            required
                                        />
                                    </div>

                                    <div className="mb-3 d-flex align-items-center">
                                        <label htmlFor="password" className="form-label"><i className="fa-solid fa-lock fa-2x text-dark me-3"></i></label>
                                        <input type={`${showPassword ? 'text' : 'password'}`} className="form-control rounded-5" id="password" name="password" value={inputs.password} onChange={handleChange} autoComplete='password' placeholder='Enter password' required />
                                        <button
                                            type="button"
                                            className="btn"
                                            onClick={togglePasswordVisibility}
                                            aria-label="Toggle password visibility"
                                        >
                                            <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                        </button>
                                    </div>
                                    <button type="submit" className="btn btn-dark rounded-5 w-100">Login</button>
                                </form>
                              
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default AdminLogin
