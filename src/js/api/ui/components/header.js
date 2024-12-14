function loadHeader() {
    const accessToken = localStorage.getItem('accessToken');
    const name = localStorage.getItem('name');
    
    let headerHTML = `
        <nav class="bg-[#00708E] p-4">
            <ul class="flex justify-between items-center space-x-6 text-white">
                <li><a href="/index.html" class="hover:text-gray-200">Home page</a></li>
    `;

    if (accessToken) {
        headerHTML += `
            <li><a href="/profile/index.html?name=${name}" class="hover:text-gray-200">My Profile</a></li>
            <li><a href="/post/create/index.html" class="hover:text-gray-200">Add a Listing</a></li>
            <button id="logout-button" class="bg-transparent text-white border border-white px-4 py-2 rounded-lg hover:bg-white hover:text-[#00708E] transition">Log Out</button>
        `;
    } else {
        headerHTML += `
            <li><a href="/auth/login/index.html" class="hover:text-gray-200">Log in</a></li>
            <li><a href="/auth/register/index.html" class="hover:text-gray-200">Register</a></li>
        `;
    }

    headerHTML += `
            </ul>
        </nav>
    `;

    const headerDiv = document.getElementById('header');
    if (headerDiv) {
        headerDiv.innerHTML = headerHTML;
    }

    // Logout functionality
    if (accessToken) {
        const logoutButton = document.getElementById('logout-button');
        if (logoutButton) {
            logoutButton.addEventListener('click', function() {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('name');
                window.location.href = 'index.html';
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', loadHeader);
