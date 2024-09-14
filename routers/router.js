import express from 'express';
import { isAuthenticated } from './middlewares/auth.js'; // Update the path as necessary

const router = express.Router();

// Route to display the profile edit page
router.get('/profile_Manage/profile-edit', (req, res) => {
    res.render('profile-edit', { user: req.user }); // Adjust to match your view file
});


// Route to handle profile updates
router.post('/profile/edit', isAuthenticated, (req, res) => {
    const { username, email } = req.body;
    // Update user profile logic here
    // For example: User.findByIdAndUpdate(req.user.id, { username, email });
    res.redirect('/profile');
});

// Route to display account settings page
router.get('/account-settings', isAuthenticated, (req, res) => {
    res.render('account-settings', { user: req.user });
});

// Route to handle account settings updates
router.post('/account-settings', isAuthenticated, (req, res) => {
    const { password } = req.body;
    // Update account settings logic here
    // For example: User.findByIdAndUpdate(req.user.id, { password });
    res.redirect('/account-settings');
});

export default router;
