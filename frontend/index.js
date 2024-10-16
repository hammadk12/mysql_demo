
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
    fetch('http://localhost:3000/api/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => Promise.reject(err));
        }
        return response.json();
    })
    .then(result => {
        alert('Account Created: ' + result.message);
        form.reset();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Account Creation Failed: ' + (error.error || 'Unknown error'));
    });
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
    if (!/^\d{10}$/.test(data.phoneNumber)) {
        alert('Please enter a 10-digit phone number without dashes.');
        return false;
    }
    return true;
}

// search bar function
function searchUsers() {
    const searchTerm = document.getElementById('searchInput').value;

    fetch(`http://localhost:3000/api/search?name=${encodeURIComponent(searchTerm)}`)
        .then(response => response.json())
        .then(data => {
            const resultsDiv = document.getElementById('searchResults')
            resultsDiv.innerHTML = '';

            if (data.length === 0) {
                resultsDiv.innerHTML = 'No users found.';
                return;
            }

            data.forEach(user => {
                resultsDiv.innerHTML += `
                <div>
                    <p>Name: ${user.first_name} ${user.last_name}</p>
                    <p>Email: ${user.email}</p>
                    <p>Phone: ${user.phone_number}</p>
                    <hr>
                </div>`;
            });
        })
        .catch(error => {
            console.error('Error:', error);

        document.getElementById('searchResults').innerHTML = 'An error occurred while searching.';
        });
}