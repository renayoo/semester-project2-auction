import { headers } from './api/headers';
import { API_BASE } from './api/constants';

const listingsContainer = document.getElementById('listings');

// Fetching listing from API
async function loadListings() {
    try {
        const response = await fetch(`${API_BASE}/auction/listings`, {
            method: 'GET',
            headers: headers(),
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch listings: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Data fetched from API:', data);

        // Check listings
        if (data && data.data && data.data.length > 0) {
            // Loop through listings and create HTML
            const listingsHtml = data.data.map(item => {
                // Safely access media and check for missing fields
                const mediaUrl = item.media && item.media[0] ? item.media[0].url : 'default-image.jpg';
                const mediaAlt = item.media && item.media[0] ? item.media[0].alt : 'No image available';

                // Generate the HTML for each listing with a clickable link
                return `
                    <div class="listing-item">
                        <a href="auction/listings/${item.id}" class="listing-link">
                            <img src="${mediaUrl}" alt="${mediaAlt}" class="listing-image" />
                        </a>
                        <div class="listing-details">
                            <h3 class="listing-title">${item.title}</h3>
                            <p class="listing-description">${item.description}</p>
                            <p class="listing-tags">Tags: ${item.tags.join(', ')}</p>
                            <p class="listing-end-date">Ends At: ${new Date(item.endsAt).toLocaleString()}</p>
                            <p class="listing-bids">Bids: ${item._count.bids}</p>
                            <!-- View Listing button -->
                            <a href="/auction/listings/${item.id}" class="view-listing-button">View Listing</a>
                        </div>
                    </div>
                `;
            }).join('');

            // Inject HTML into the listings container
            listingsContainer.innerHTML = listingsHtml;
        } else {
            listingsContainer.innerHTML = '<p>No listings available.</p>';
        }
    } catch (error) {
        console.error('Error loading listings:', error);
        listingsContainer.innerHTML = '<p>Failed to load listings. Please try again later.</p>';
    }
}

// Load the listings when the page is loaded
document.addEventListener('DOMContentLoaded', loadListings);

// Select the logout button
const logoutButton = document.getElementById('logout-button');

// Function to handle logout
function logoutUser() {
    // Clear the local storage (or session storage) to remove tokens and user data
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('name');

    // Redirect to the home page
    window.location.href = '/index.html';
}

// Attach event listener to the logout button
if (logoutButton) {
    logoutButton.addEventListener('click', logoutUser);
} else {
    console.error('Logout button not found.');
}
