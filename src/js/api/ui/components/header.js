// Function to dynamically load the navbar
function loadHeader() {
    // Check if the user has an access token for login
    const accessToken = localStorage.getItem('accessToken');
    const name = localStorage.getItem('name');
    
    // Start building the header HTML
    let headerHTML = `
        <nav>
            <ul>
                <li><a href="/index.html">Home page</a></li>
                <li><a href="/post/index.html">All listings</a></li>
    `;

    // If user is logged in (accessToken), show the "My Profile", "Create a listing", and "Log out" buttons
    if (accessToken) {
        // Profile link, name in localStorage 
        headerHTML += `
            <li><a href="/profile/index.html?name=${name}">My Profile</a></li>
            <li><a href="/post/create/index.html">Add a Listing</a></li>
            <button id="logout-button">Log Out</button>
        `;
    } else {
        // If user is not logged in (no accessToken), show the "Login" and "Register" buttons
        headerHTML += `
            <li><a href="/auth/login/index.html">Log in</a></li>
            <li><a href="/auth/register/index.html">Register</a></li>
        `;
    }

    // Close the <ul> and <nav>
    headerHTML += `
            </ul>
        </nav>
    `;

    
    const headerDiv = document.getElementById('header');
    if (headerDiv) {
        headerDiv.innerHTML = headerHTML;
    }

    // If the user is logged in (accessToken exists), logout Btn
    if (accessToken) {
        const logoutButton = document.getElementById('logout-button');
        if (logoutButton) {
            logoutButton.addEventListener('click', function() {
                // Log out the user (clear session data)
                localStorage.removeItem('accessToken');
                localStorage.removeItem('name');         
                // Redirect to the home page
                window.location.href = 'index.html';
            });
        }
    }
}

// Wait until the DOM is fully loaded before injecting the header
document.addEventListener('DOMContentLoaded', loadHeader);
