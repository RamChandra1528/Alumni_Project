// "// Authentication controller" 
export function logout(req, res) {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/'); // Redirect to home page after logout
    });
}

// controllers/authController.js
import { randomBytes } from 'crypto';
import User from '../models/userModel.js';
import sendEmail from '../utils/sendEmail'; // You need to create this utility 
const User = require('../models/userModel.js').default; // Adjust path as necessary

// Render the forgot password page
export function forgotPasswordPage(req, res) {
  res.render('forgot-password');
}

// Handle the forgot password form submission
export async function handleForgotPassword(req, res) {
  const { email } = req.body;
  
  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    req.flash('error', 'No account with that email address exists.');
    return res.redirect('/forgot-password');
  }

  // Generate a password reset token
  const resetToken = randomBytes(20).toString('hex');
  
  // Set the token and expiry in the user model
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  
  await user.save();

  // Send email with the token
  const resetURL = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetURL}`;
  
  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset',
      message
    });
    req.flash('success', 'An email has been sent to your address with further instructions.');
    res.redirect('/forgot-password');
  } catch (err) {
    req.flash('error', 'There was an error sending the email. Please try again later.');
    res.redirect('/forgot-password');
  }
}
