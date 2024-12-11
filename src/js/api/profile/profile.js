import { headers } from '../headers';

// Function to fetch the profile based on name from URL parameter
async function fetchProfile() {
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('name');

    if (!name) {
        console.error("No name found in the URL");
        return;
    }

    try {
        // Fetch the profile
        const response = await fetch(`https://v2.api.noroff.dev/auction/profiles/${name}`, {
            method: "GET",
            headers: headers(),
        });

        if (!response.ok) {
            throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        const profile = data.data;

        // Update the profile information in the DOM
        document.getElementById('banner').src = profile.banner?.url || '';
        document.getElementById('avatar').src = profile.avatar?.url || '';
        document.getElementById('name').textContent = profile.name;
        document.getElementById('email').textContent = profile.email;
        document.getElementById('bio').textContent = profile.bio || 'No bio available';
        document.getElementById('credits').textContent = profile.credits;
        document.getElementById('listings-count').textContent = profile._count.listings || 0;
        document.getElementById('wins-count').textContent = profile._count.wins || 0;

        // Add event listener to the edit profile button to redirect to the edit page
        const editProfileBtn = document.getElementById('edit-profile-btn');
        if (editProfileBtn) {
            editProfileBtn.addEventListener('click', function () {
                // Redirect to the edit page with the 'name' query parameter
                window.location.href = `/profile/edit.html?name=${profile.name}`;
            });
        }

        // Fetch and display the user's listings
        fetchListings(name);

        // Add "Back to Feed" button functionality
        const backToFeedBtn = document.getElementById('back-to-feed-btn');
        if (backToFeedBtn) {
            backToFeedBtn.addEventListener('click', function () {
                window.location.href = '/feed.html';
            });
        }

    } catch (error) {
        console.error("Error fetching profile:", error);
        document.getElementById('profile-container').innerHTML = '<p>Error loading profile. Please try again later.</p>';
    }
}

// Function to fetch and display the profile's auction listings
async function fetchListings(name) {
    try {
        const response = await fetch(`https://v2.api.noroff.dev/auction/profiles/${name}/listings`, {
            method: "GET",
            headers: headers(),
        });

        if (!response.ok) {
            throw new Error("Failed to fetch listings");
        }

        const data = await response.json();

        // Get the listings container
        const listingsContainer = document.getElementById('listings-container');
        listingsContainer.innerHTML = ''; // Clear any existing content

        if (data.data.length === 0) {
            listingsContainer.innerHTML = '<p>No listings found.</p>';
            return;
        }

        // Create listing cards dynamically
        data.data.forEach(listing => {
            const card = document.createElement('div');
            card.classList.add('listing-card');

            card.innerHTML = `
                <img src="${listing.media[0]?.url || ''}" alt="${listing.media[0]?.alt || 'Listing image'}" class="listing-image">
                <h3 class="listing-title">${listing.title}</h3>
                <p class="listing-description">${listing.description || 'No description available'}</p>
                <p class="listing-ends">Ends at: ${new Date(listing.endsAt).toLocaleString()}</p>
                <p class="listing-bids">Bids: ${listing._count.bids}</p>
                <button class="view-listing-btn" data-listing-id="${listing.id}">View Listing</button>  <!-- View Listing Button -->
            `;

            listingsContainer.appendChild(card);
        });

        // Add event listeners for the "View Listing" buttons
        const viewListingButtons = document.querySelectorAll('.view-listing-btn');
        viewListingButtons.forEach(button => {
            button.addEventListener('click', function() {
                const listingId = button.getAttribute('data-listing-id');
                window.location.href = `/listings/index.html?id=${listingId}`;  // Redirect to the listing page
            });
        });

    } catch (error) {
        console.error("Error fetching listings:", error);
        document.getElementById('listings-container').innerHTML = '<p>Error loading listings. Please try again later.</p>';
    }
}

// Wait until the DOM is loaded to fetch the profile
document.addEventListener('DOMContentLoaded', fetchProfile);
