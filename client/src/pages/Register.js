import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { authActions } from "../redux/store";
import { useDispatch } from 'react-redux';

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false); // State to manage password visibility

    // Function to toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
    };
    //state
    const [inputs, setInputs] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [sendVerificationEmail, setSendVerificationEmail] = useState(false);
    const [loading, setLoading] = useState(false); // New loading state

    //handle change
    const handleChange = (e) => {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    }

    const isValidName = (name) => /^[a-zA-Z]+$/.test(name);
    const isValidEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
    const isValidPassword = (password) => {
        const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8}$/;
        return regex.test(password);
    }

    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault()
        //console.log(inputs)
        // Validate name
        let isValid = true;

        if (!isValidName(inputs.name)) {
            setErrors(prev => ({ ...prev, name: "Name should contain only alphabets." }));
            isValid = false;
        } else {
            setErrors(prev => ({ ...prev, name: "" }));
        }

        // Validate email
        if (!isValidEmail(inputs.email)) {
            setErrors(prev => ({ ...prev, email: "Please enter a valid email address." }));
            isValid = false;
        } else {
            setErrors(prev => ({ ...prev, email: "" }));
        }

        // Validate password
        if (!isValidPassword(inputs.password)) {
            setErrors(prev => ({ ...prev, password: "Password requirement: Exactly 8 characters long, at least 1 uppercase letter, 1 number, and 1 special character." }));
            isValid = false;
        } else {
            setErrors(prev => ({ ...prev, password: "" }));
        }

        if (!isValid) return;
        setLoading(true); // Set loading to true

        try {

            const { data } = await axios.post("/api/v1/user/register", { username: inputs.name, email: inputs.email, password: inputs.password, sendVerification: sendVerificationEmail // Ensure this field is sent
            });
            console.log(data)
            if (data.success) {
                dispatch(authActions.login());
                alert("Verification link has been sent to your mail")
                // alert("User registered successfully");
                localStorage.setItem("username", data.user.username);
                localStorage.setItem("role", data.user.role);

                navigate('/login');
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {

                setErrors(prev => ({ ...prev, email: "Email is already registered." }));

            } else {
                console.log(error);
            }
        }finally {
            setLoading(false); // Reset loading state
        }
    }
    return (
        <>
            <div className="container d-flex justify-content-center align-items-center my-4">
                <div className="row w-100">
                    <div className="col-md-6 col-lg-4 mx-auto">
                    {loading && <div className="alert alert-info">Processing your request... This may take some time.</div>}
                        {errors.name && <div className="alert alert-danger my-2">{errors.name}</div>}
                        {errors.email && <div className="alert alert-danger my-2">{errors.email}</div>}
                        {errors.password &&
                            <div className="alert alert-danger mb-3"><div>Password requirement:</div>
                                <div>Exactly 8 characters long</div>
                                <div>At least 1 uppercase letter</div>
                                <div>At least 1 number</div>
                                <div>At least 1 special character</div>
                            </div>}

                        <div className='card p-3 shadow'>
                            <div className="card-body">
                                <h1 className="card-title text-center mb-4 text-dark text-uppercase">Register</h1>
                                <form onSubmit={handleSubmit}>

                                    <div className="mb-3 d-flex align-items-center">
                                        <label htmlFor="name" className="form-label"><i className="fa-solid fa-user fa-2x text-dark me-2"></i></label>
                                        <input type="text" className="form-control rounded-5" id="name" name="name" value={inputs.name} onChange={handleChange} placeholder='Enter name' required />
                                    </div>


                                    <div className="mb-3 d-flex align-items-center">
                                        <label htmlFor="email" className="form-label">                                            <i className="fa-solid fa-envelope fa-2x text-dark me-3"></i>
                                        </label>
                                        <input type="email" className="form-control rounded-5" id="email" name="email" value={inputs.email} onChange={handleChange} placeholder='Enter email' required />
                                    </div>

                                    <div className="mb-3 d-flex align-items-center">
                                        <label htmlFor="password" className="form-label"><i className="fa-solid fa-lock fa-2x text-dark me-3"></i></label>
                                        <input type={`${showPassword ? 'text' : 'password'}`} className="form-control rounded-5" id="password" name="password" value={inputs.password} onChange={handleChange} autoComplete='password' placeholder='Enter Password' required />
                                        <button
                                            type="button"
                                            className="btn"
                                            onClick={togglePasswordVisibility}
                                            aria-label="Toggle password visibility"
                                        >
                                            <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                        </button>
                                    </div>
                                    <div className="form-check mb-3">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="sendVerificationEmail"
                                        checked={sendVerificationEmail}
                                        onChange={(e) => setSendVerificationEmail(e.target.checked)}
                                        required
                                    />
                                    <label className="form-check-label" htmlFor="sendVerificationEmail">Send verification email</label>
                                </div>
                                    <button type="submit" className="btn btn-dark rounded-5 w-100">Register</button>
                                </form>
                                <div className="text-center mt-3">
                                    <button type="submit" className="btn btn-white text-primary w-100" onClick={() => navigate('/login')}>Already registered? Please Login</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            </div >

        </>
    )
}

export default Register
