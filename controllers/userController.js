const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { getNextSequence } = require('../models/counter');
const { token } = require("morgan");

//get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({});

    if (!users) {
      return res.status(200).send({
        success: false,
        message: "No Users Found"
      });
    }
    return res.status(200).send({
      userCount: users.length,
      success: true,
      message: "All Users",
      users
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Error in Getting all Users",
      success: false,
      error
    });
  }
};


//register user
exports.registerController = async (req, res) => {
  try {
    const { username, email, password, sendVerification } = req.body;
    const userId = await getNextSequence('userId'); // Generate the next bus ID
    const newUserId = `U${userId}`; // Prefix with 'B'

    //validation
    if (!username || !email || !password) {
      return res.status(401).send({
        success: false,
        message: "Please fill all fields",
      });
    }

    //existing user
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(401).send({
        success: false,
        message: "User already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 8);

    const verificationToken = crypto.randomBytes(6).toString('hex');
    const verificationTokenExpires = Date.now() + 3600000; // Token expires in 1 hour

    // Save new user
    const user = new userModel({
      userId: newUserId,
      username,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpires,
      isVerified: false // Default to false
    });

    await user.save();
const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
      },
    });

    // Send verification email if requested
    if (sendVerification) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verify Your Email',
        text: `You are receiving this email to verify your account.
               Please click on the following link, or paste this into your browser to complete the process:
               <a href="${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}" style="color: blue;">Verify Email</a>
               If you did not request this, please ignore this email.`,
      };
      await transporter.sendMail(mailOptions);
    }

    return res.status(200).send({
      success: true,
      message: "New User Created",
      user
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Error in Register Callback",
      success: false,
      error
    });
  }
};

exports.verifyEmailController = async (req, res) => {

  const { token } = req.query; // Get the token from the query parameters
  try {
    // Find the user by the verification token
    const user = await userModel.findOne({ verificationToken: token });

    // Check if the user exists and if the token has not expired
    if (!user || user.verificationTokenExpires < Date.now()) {
      return res.status(400).send({
        success: false,
        message: "Invalid or expired verification token."
      });
    }

    // Set the user as verified
    user.isVerified = true; // Mark the user as verified
    user.verificationToken = undefined; // Clear the token
    user.verificationTokenExpires = undefined; // Clear the expiry  these are not there in the model is that okay
    await user.save();

    return res.status(200).send({
      success: true,
      message: "Email verified successfully! You can now log in."
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Error verifying email.",
      error: error.message || error
    });
  }
};

//login user
exports.loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    //If email or password is not filled
    if (!email || !password) {
      return res.status(401).send({
        success: false,
        message: "Please provide email or password"
      });
    }
    //If email not registered
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "Email is not registered"
      });
    }
    //If password does not match with registered email
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({
        success: false,
        message: "Invalid email or password"
      });
    }
    const token = await jwt.sign({ _id: user._id, user: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).send({
      success: true,
      message: "Login Successful",
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Error in Login Callback",
      success: false,
      error
    });
  }
};


exports.forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "Email not registered"
      });
    }
    console.log('User found:', user); // Log user found

    // Create a reset token
    const token = crypto.randomBytes(32).toString('hex');

    // Set token and expiry in user document
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiration
    await user.save();

    // Send email
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,  // Use 587 if you prefer TLS instead of SSL
      secure: true,
      auth: {
        user: process.env.AUTH_EMAIL, // Your Gmail
        pass: process.env.AUTH_PASS, // Your Gmail App Password
      }
    });

    const mailOptions = {
      to: user.email,
      from: process.env.AUTH_EMAIL,
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
        `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
        `${process.env.FRONTEND_URL}/reset-password/${token}\n\n` +
        `If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };

    await transporter.sendMail(mailOptions);
    res.status(200).send({
      success: true,
      message: 'Reset password email sent'
    });

  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error in forgot password controller',
      error: error.message || error // Send the error message back in the response for debugging
    });
  }
};

exports.resetPasswordController = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword, confirmPassword } = req.body;

    // Check if the token is valid
    const user = await userModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() } // Token should not have expired
    });

    if (!user) {
      return res.status(401).send({
        success: false,
        message: "Password reset token is invalid or has expired"
      });
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      return res.status(401).send({
        success: false,
        message: "Passwords do not match"
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 8);

    // Update user's password and remove the reset token fields
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).send({
      success: true,
      message: 'Password has been reset'
    });

  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error in reset password controller',
      error
    });
  }
};
