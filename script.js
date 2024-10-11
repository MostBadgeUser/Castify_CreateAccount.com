<script>
    // Check if user is already registered
    function isUserRegistered(username) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        return users.some(user => user.username === username);
    }

    // Register user and store in localStorage
    function registerUser(username, email, password) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        users.push({ username, email, password });
        localStorage.setItem('users', JSON.stringify(users));

        // Save the registered username (nickname) to localStorage for the session
        localStorage.setItem('currentUser', username);
    }

    // Simulate sending an email (replace with actual email service integration if needed)
    function sendWelcomeEmail(email) {
        // Simulating email sending. In a real application, you would use a service like EmailJS
        console.log(`Email sent to ${email}: Welcome to Castify!`);
    }

    // Handle registration form submission
    document.getElementById('registrationForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (!isUserRegistered(username)) {
            registerUser(username, email, password);
            sendWelcomeEmail(email); // Call the email sending function
            alert('Registration successful! A welcome email has been sent. Redirecting...');
            // Redirect to the welcome/menu page after successful registration
            window.location.href = 'https://mostbadgeuser.github.io/Castify_Welcome.com/'; // Ensure the URL is correct
        } else {
            alert('Username already taken!');
        }
    });
</script>