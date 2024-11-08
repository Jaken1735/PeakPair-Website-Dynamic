// server.js
const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies (for form submissions)
app.use(express.static('public')); // Serve static files from the 'public' folder

// Temporary in-memory storage for routines
let routines = [];

// API to fetch all routines
app.get('/api/routines', (req, res) => {
    res.json(routines);
});

// API to add a new routine
app.post('/api/routines', (req, res) => {
    const routine = req.body;
    routines.push(routine);
    res.status(201).json(routine);
});

const validUsername = 'testuser';
const validPassword = 'password123';

const validTrainer = 'trainer123';
const trainerPassword = 'password123'

// Login route
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    console.log(req.body)

    console.log('Username: ', username)
    console.log('Password: ', password)

    // Replace this with actual authentication logic
    if (username === validUsername && password === validPassword) {
        console.log('redirecting to userLogin...')
        res.redirect('/userLogin.html'); // Redirect to loginUser.html upon successful login
    } else if (username == validTrainer && password == trainerPassword) {
        console.log('redirecting to trainerLogin...')
        res.redirect('/trainerLogin.html')
    } else {
        res.redirect('/login.html');
    }
});

// Serve HTML files (fallback to index_old.html for unknown routes)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = 3004;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
