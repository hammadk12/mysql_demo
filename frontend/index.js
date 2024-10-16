const form = document.getElementById('signupForm')

form.addEventListener('submit', handleSubmit);

function handleSubmit(event) {
    event.preventDefault(); // Prevent default form submission

    // Get form data
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    // Send data to server
    if (validateForm(data)) {
        sendData(data);
    }
}

// sending data
function sendData(data) {
    fetch('/api/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(result => {
        if (result.message) {
            alert('Account Created!');
            form.reset();
        } else {
            alert('Account Creation Failed: ' + (result.error || 'Unknown error'))
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred, try again.')
    })
}

// form validation
function validateForm(data) {
    if (!data.firstName || !data.lastName) {
        alert('Please enter both first and last name.')
        return false;
    }
    if (!data.email || !data.email.includes('@')) {
        alert('Please enter a valid email address.')
        return false;
    }
    return true;
}