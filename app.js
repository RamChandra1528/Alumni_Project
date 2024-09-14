import express from 'express';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import path from 'path';
import session from 'express-session';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import nodemailer from 'nodemailer';
import passport from 'passport';
import mongoose from 'mongoose';
import flash from 'connect-flash';

// import passport from 'passport';

// Load environment variables
dotenv.config();

// Handle __dirname and __filename in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session middleware configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'default-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));
app.use(passport.initialize());
app.use(passport.session());

// / Express session configuration for session management
app.use(session({
    secret: process.env.SESSION_SECRET || 'mysecretkey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Passport middleware for authentication handling
app.use(passport.initialize());
app.use(passport.session());

// Flash middleware for showing success/error messages
app.use(flash());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected successfully');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err.message);
});

// Define User schema and model with Mongoose
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Routes
app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

app.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});

app.get('/register', (req, res) => {
    res.render('register', { title: 'Register' });
});

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    let errors = [];

    if (!name || !email || !password) {
        errors.push({ msg: 'Please fill in all fields' });
    }

    if (password.length < 6) {
        errors.push({ msg: 'Password should be at least 6 characters' });
    }

    if (errors.length > 0) {
        return res.render('register', {
            errors,
            name,
            email,
            password
        });
    }

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            errors.push({ msg: 'Email is already registered' });
            return res.render('register', {
                errors,
                name,
                email,
                password
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();

        req.flash('success_msg', 'You are now registered and can log in');
        res.redirect('/login');
    } catch (err) {
        console.error('Error saving user:', err);
        res.render('register', {
            errors: [{ msg: 'Server error. Please try again later.' }]
        });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            req.flash('error_msg', 'User does not exist');
            return res.redirect('/login');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            req.flash('error_msg', 'Incorrect password');
            return res.redirect('/login');
        }

        // Setting session user
        req.session.user = user;

        req.flash('success_msg', 'Login successful');
        res.redirect('/home');
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Server error');
    }
});

app.get('/home', (req, res) => {
    if (req.session.user) {
        res.render('home', { user: req.session.user });
    } else {
        res.redirect('/login');
    }
});
// ...................................................................................................
// Home Page
app.get('/home', (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
        return res.redirect('/login'); // Redirect to login if no user is logged in
    }

    db.query('SELECT name FROM users WHERE id = ?', [userId], (err, results) => {
        if (err) return res.status(500).send('Error fetching user data');
        if (results.length === 0) return res.status(404).send('User not found');

        const user = results[0];
        res.render('home', { user });
    });
});

// Logout route
app.get('/logout', (req, res) => {
    // Destroy the session and redirect to home
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Error logging out');
        }
        res.redirect('/');
    });
});

// Help page
app.get('/help', (req, res) => {
    res.render('help');
});

// About page
app.get('/about', (req, res) => {
    res.render('about');
});

// Contact page
app.get('/contact', (req, res) => {
    res.render('contact');
});
// profile-edit page
app.get('/profile-edit', (req, res) => {
    res.render('profile-edit', { user: req.user });
});
app.post('/profile-edit', (req, res) => {
    const { username, email } = req.body;

    // Assuming you have a User model and a method to update user data
    User.findByIdAndUpdate(req.user.id, { username, email }, (err, updatedUser) => {
        if (err) {
            return res.status(500).send('Error updating profile');
        }
        // Redirect to home page after profile update
        res.redirect('/home'); // Replace '/home' with your actual home page route
    });
});

// account-settings page
app.get('/account', (req, res) => {
    res.render('account');
});
app.get('/booking-session', (req, res) => {
    res.render('booking-session');
});

app.get('/My_Network/My-network', (req, res) => {
    res.render('My_Network/My-network');
});
// ...................................................................................................................
app.get('/forgot-password', (req, res) => {
    res.render('forgot-password');
});
// In-memory store for demonstration
const users = {
    'test@example.com': { password: 'oldPassword' }  // Example user
};
const otpStore = {};

// Configure nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password'
    }
});

// Request OTP
app.post('/request-reset', (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    if (!users[email]) {
        return res.status(404).json({ message: 'Email not found' });
    }

    // Generate OTP and send email
    const otp = crypto.randomInt(100000, 999999).toString();
    otpStore[email] = otp;

    transporter.sendMail({
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Password Reset OTP',
        text: `Your OTP for password reset is ${otp}`,
    }, (error, info) => {
        if (error) {
            return res.status(500).json({ message: 'Error sending OTP' });
        }
        res.json({ message: 'OTP sent to your email' });
    });
});

// Verify OTP
app.post('/verify-otp', (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ message: 'Email and OTP are required' });
    }

    if (otpStore[email] !== otp) {
        return res.status(400).json({ message: 'Invalid OTP' });
    }

    delete otpStore[email];  // Clear OTP after verification
    res.json({ message: 'OTP verified' });
});

// Reset Password
app.post('/reset-password/:token', (req, res) => {
    const { newPassword } = req.body;
    const { token } = req.params;

    // Here, you would typically verify the token and update the password.
    // For this example, we will simulate a successful password reset.

    if (!newPassword) {
        return res.status(400).json({ message: 'New password is required' });
    }

    // For this example, we will simply return success
    res.json({ message: 'Password reset successful' });
});

// <------------------------------------------------------------------------>>>>>>>>>>>>>>>>>>>
app.post('/account', (req, res) => {
    const { password } = req.body;

    // Assuming you have a User model and a method to update the user's password
    User.findByIdAndUpdate(req.user.id, { password }, (err, updatedUser) => {
        if (err) {
            return res.status(500).send('Error updating account settings');
        }
        // Redirect to home page after account settings update
        res.redirect('/home'); // Replace '/home' with your actual home page route
    });
});
app.get('/home', (req, res) => {
    res.render('home', { user: req.user });
});


// Create a route to handle the form submission
app.post('/send-email', async (req, res) => {
    const { name, email, message } = req.body;

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Change this to your email provider
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // Email options for the admin
    const adminMailOptions = {
        from: email,
        to: process.env.EMAIL_USER,
        subject: 'New Contact Form Submission',
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    };

    // Email options for the user
    const userMailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Message Received',
        text: `Hi ${name},\n\nThank you for reaching out to us. We have received your message and will get back to you soon.\n\nBest regards,\nUniversity Alumni Nexus`
    };

    try {
        // Send email to admin
        await transporter.sendMail(adminMailOptions);
        // Send confirmation email to user
        await transporter.sendMail(userMailOptions);
        res.json({ message: 'Your message has been sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.json({ message: 'There was an error sending your message. Please try again later.' });
    }
});
// <---------------------------------------------------------------------------------------------------------------->
// const users = []; // This should be replaced with a database in a real application

// Register Endpoint
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, email, password: hashedPassword });
    res.status(201).send('User registered');
});

// Login Endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ username: user.username }, 'your_jwt_secret');
        res.json({ token });
    } else {
        res.status(401).send('Invalid credentials');
    }
});

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, 'your_jwt_secret', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Protected Route
app.get('/home', authenticateToken, (req, res) => {
    res.json({ username: req.user.username });
});
// Handle 404 errors
app.use((req, res) => {
    res.status(404).send('Page not found');
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong');
});

// Start server
app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});



// /////////////////////////////////live server chat
import http from 'http';
import { Server as SocketIO } from 'socket.io';
// import express from 'express';

// const app = express();
const server = http.createServer(app);

// Instantiate Socket.IO server
const io = new SocketIO(server);

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('message', (msg) => {
        console.log('Message: ' + msg);
        
        let response = '';
        if (msg.toLowerCase().includes('hello')) {
            response = "Hello! How can I assist you today?";
        } else if (msg.toLowerCase().includes('ansh')) {
            response = "Nice to meet you, Ansh! How can I help you?";
        } else {
            response = "I'm here to help! What do you need assistance with?";
        }

        io.emit('message', response);
    });
});