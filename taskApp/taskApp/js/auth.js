document.addEventListener('DOMContentLoaded', () => {
    const authForms = {
        login: document.getElementById('loginForm'),
        signup: document.getElementById('signupForm')
    };

    // Initialize user storage if not exists
    if(!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([]));
    }

    // Handle form submissions
    if(authForms.login) {
        authForms.login.addEventListener('submit', handleLogin);
    }
    
    if(authForms.signup) {
        authForms.signup.addEventListener('submit', handleSignup);
    }

    function handleLogin(e) {
        e.preventDefault();
        const email = e.target.querySelector('#email').value;
        const password = e.target.querySelector('#password').value;
        
        const users = JSON.parse(localStorage.getItem('users'));
        const user = users.find(u => u.email === email && u.password === password);

        if(user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            window.location.href = 'dashboard.html';
        } else {
            alert('Invalid credentials');
        }
    }

    function handleSignup(e) {
        e.preventDefault();
        const email = e.target.querySelector('#signupEmail').value;
        const password = e.target.querySelector('#signupPassword').value;
        const confirmPassword = e.target.querySelector('#confirmPassword').value;

        if(password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users'));
        if(users.some(u => u.email === email)) {
            alert('Email already registered');
            return;
        }

        const newUser = {
            id: Date.now(),
            email,
            password,
            joined: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        alert('Registration successful!');
        window.location.href = 'dashboard.html';
    }

    // Check for existing session
    if(localStorage.getItem('currentUser') && window.location.pathname.includes('index.html')) {
        window.location.href = 'dashboard.html';
    }
});