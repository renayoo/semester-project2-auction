// Navigation menu for the webpage, with hamburger menu
function loadHeader() {
    const accessToken = localStorage.getItem('accessToken');
    const name = localStorage.getItem('name');

    let headerHTML = `
        <nav class="bg-[#00708E] p-4 relative z-20">
            <div class="flex justify-between items-center w-full">
                <!-- Hamburger Button (only visible on mobile) -->
                <button id="hamburger-button" class="text-white lg:hidden">
                    <svg id="hamburger-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                    <svg id="close-icon" class="w-6 h-6 hidden" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>

                <!-- Nav Links (for larger screens) -->
                <ul id="nav-links" class="flex justify-between items-center space-x-6 text-white hidden lg:flex w-full">
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
                <!-- Mobile Menu Dropdown -->
                <ul id="mobile-nav" class="lg:hidden absolute top-0 left-0 w-full bg-[#00708E] hidden text-white z-30 transition-transform transform">
                    <li><a href="/index.html" class="block px-4 py-2">Home page</a></li>
    `;

    if (accessToken) {
        headerHTML += `
            <li><a href="/profile/index.html?name=${name}" class="block px-4 py-2">My Profile</a></li>
            <li><a href="/post/create/index.html" class="block px-4 py-2">Add a Listing</a></li>
            <button id="logout-button-mobile" class="block px-4 py-2 bg-transparent text-white border border-white hover:bg-white hover:text-[#00708E] transition">Log Out</button>
        `;
    } else {
        headerHTML += `
            <li><a href="/auth/login/index.html" class="block px-4 py-2">Log in</a></li>
            <li><a href="/auth/register/index.html" class="block px-4 py-2">Register</a></li>
        `;
    }

    headerHTML += `
                </ul>
            </div>
        </nav>
    `;

    const headerDiv = document.getElementById('header');
    if (headerDiv) {
        headerDiv.innerHTML = headerHTML;
    }

    // Logout functionality
    if (accessToken) {
        const logoutButton = document.getElementById('logout-button');
        const logoutButtonMobile = document.getElementById('logout-button-mobile');
        if (logoutButton) {
            logoutButton.addEventListener('click', function() {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('name');
                window.location.href = 'index.html';
            });
        }
        if (logoutButtonMobile) {
            logoutButtonMobile.addEventListener('click', function() {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('name');
                window.location.href = 'index.html';
            });
        }
    }

    // Hamburger Menu Toggle
    const hamburgerButton = document.getElementById('hamburger-button');
    const mobileNav = document.getElementById('mobile-nav');
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const closeIcon = document.getElementById('close-icon');
    const body = document.body;

    if (hamburgerButton) {
        hamburgerButton.addEventListener('click', function() {
            mobileNav.classList.toggle('hidden'); // Toggle visibility of mobile menu
            hamburgerIcon.classList.toggle('hidden'); // Toggle hamburger icon visibility
            closeIcon.classList.toggle('hidden'); // Toggle X icon visibility
            body.classList.toggle('overflow-hidden'); // Prevent scrolling when menu is open
        });
    }
}

document.addEventListener('DOMContentLoaded', loadHeader);
