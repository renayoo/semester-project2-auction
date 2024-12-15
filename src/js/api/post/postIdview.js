import { API_BASE } from "../constants";
import { headers } from '../headers.js';

// Function to fetch listing data by ID
async function fetchListingById(listingId) {
    try {
        const response = await fetch(`${API_BASE}/auction/listings/${listingId}?_seller=true&_bids=true`, {
            method: 'GET',
            headers: headers(),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }

        const responseData = await response.json();
        return responseData.data;
    } catch (error) {
        console.error('Error fetching listing:', error);
        return null;
    }
}

// Function to delete a listing
async function deleteListing(listingId) {
    const confirmation = confirm('Are you sure you want to delete this listing?');
    if (!confirmation) return;

    try {
        const response = await fetch(`${API_BASE}/auction/listings/${listingId}`, {
            method: 'DELETE',
            headers: headers(),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error deleting listing:', errorData);
            alert('Failed to delete listing: ' + errorData.message);
            return;
        }

        alert('Listing deleted successfully!');
        window.location.href = '/'; // Redirect to the homepage after deletion
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to delete listing: ' + error.message);
    }
}

// Show listing details by ID
async function showListing() {
    const listingDetailsContainer = document.querySelector('#post-listing-id');
    const urlParams = new URLSearchParams(window.location.search);
    const listingId = urlParams.get('id');

    if (!listingId) {
        listingDetailsContainer.innerHTML = '<h2>No listing ID specified.</h2>';
        return;
    }

    const listing = await fetchListingById(listingId);

    if (!listing) {
        listingDetailsContainer.innerHTML = '<h2>Listing not found.</h2>';
        return;
    }

    // Access the seller's name
    const sellerName = listing.seller && listing.seller.name ? listing.seller.name : 'Unknown Seller';
    const loggedInUserName = localStorage.getItem('name');

    // Calculate the current highest bid
    const highestBid = listing.bids.length > 0
        ? Math.max(...listing.bids.map(bid => bid.amount))
        : 0;

    // Populate listing details
    listingDetailsContainer.innerHTML = `
    <h2 id="listing-title" class="text-5xl font-bold text-center text-gray-800">${listing.title}</h2>

    <!-- Display main image (smaller) -->
    <div id="listing-main-image" class="w-full max-w-md mx-auto">
        <img src="${listing.media[0]?.url}" alt="Main listing image" class="w-full h-auto max-h-72 object-cover rounded-lg shadow-lg">
    </div>

    <!-- Image carousel for additional images (larger) -->
    <div id="listing-images" class="flex overflow-x-auto space-x-4 mt-4">
        ${listing.media.slice(1).map((image, index) => `
            <img src="${image.url}" alt="${image.alt}" class="w-56 h-56 object-cover rounded-md cursor-pointer shadow-md transition-transform transform hover:scale-105" data-index="${index}" />
        `).join('')}
    </div>

    <h2 class="text-3xl font-semibold text-center text-gray-600 mb-6">${listing.description}</h2>
    <p><strong>Created on:</strong> ${new Date(listing.created).toLocaleDateString()}</p>
    <p><strong>Tags:</strong> ${listing.tags.join(', ')}</p>
    <p><strong>Auction ends at:</strong> ${new Date(listing.endsAt).toLocaleString()}</p>
    <p><strong>Bids:</strong> ${listing._count.bids}</p>
    <p><strong>Current Winning Bid:</strong> ${highestBid > 0 ? highestBid : 'No bids yet'}</p>
    
    <div id="listing-seller" class="mt-4">
        <strong>Seller:</strong> <a href="javascript:void(0);" id="seller-name" class="text-teal-600 hover:text-teal-700">${sellerName}</a>
    </div>

    <h3 class="mt-6 text-xl font-semibold text-gray-800">Place a Bid:</h3>
    <div id="place-bid" class="flex items-center space-x-4 mt-4">
        <!-- Default content will be set depending on login status -->
    </div>

    <!-- Your Credits Section directly under the "Place a Bid" input -->
    <p class="mt-4"><strong>Your Credits:</strong> <span id="user-credits">Loading...</span></p>

    <!-- Bidding History Section moved below -->
    <h3 class="mt-6 text-xl font-semibold text-gray-800">Bidding History:</h3>
    <div id="bidding-history" class="mt-4">
        ${listing.bids.length > 0 ? listing.bids.map(bid => `
            <div class="space-y-2">
                <p class="font-semibold">
                    <a href="/profile/?name=${bid.bidder.name}" class="text-teal-600 hover:text-teal-700">
                        ${bid.bidder.name}
                    </a> placed a bid of ${bid.amount} credits at ${new Date(bid.created).toLocaleString()}
                </p>
            </div>
        `).join('') : '<p>No bids yet</p>'}
    </div>

    <div id="edit-delete-buttons" class="space-x-4 mt-6">
        <!-- Buttons for edit and delete will be injected here -->
    </div>

    <div id="back-to-feed-container" class="mt-6 flex">
        <!-- Back to Feed button -->
        <button id="backToFeedBtn" class="bg-[#00708E] text-white px-6 py-2 rounded-md hover:bg-[#005F6B]">
            Back to Feed
        </button>
    </div>
`;


    // Show edit and delete buttons if the logged-in user is the seller
    if (loggedInUserName === sellerName) {
        const buttonsContainer = document.getElementById('edit-delete-buttons');
        
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit Listing';
        editButton.id = 'editListing';
        editButton.classList.add('bg-green-600', 'text-white', 'p-2', 'rounded-md', 'hover:bg-teal-700');
        editButton.addEventListener('click', () => {
            window.location.href = `/post/edit/edit.html?id=${listingId}`;
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete Listing';
        deleteButton.id = 'deleteListing';
        deleteButton.classList.add('bg-red-600', 'text-white', 'p-2', 'rounded-md', 'hover:bg-red-700');
        deleteButton.addEventListener('click', () => deleteListing(listingId));

        buttonsContainer.appendChild(editButton);
        buttonsContainer.appendChild(deleteButton);
    }

    // Event listener for seller link
    document.getElementById('seller-name').addEventListener('click', () => {
        window.location.href = `/profile/?name=${listing.seller.name}`; // Redirect to seller's profile
    });

    // Check if user is logged in (has an access token)
    const accessToken = localStorage.getItem('accessToken');  // Get the access token from localStorage

    // Display bid section or login message based on access token presence
    const placeBidSection = document.getElementById('place-bid');
    if (accessToken) {
        // Fetch and display user credits
        const loggedInUserCredits = await fetchUserCredits();
        document.getElementById('user-credits').textContent = loggedInUserCredits;

        // User is logged in, show the bid input and button
        placeBidSection.innerHTML = `
            <input type="number" id="bid-amount" placeholder="Enter your bid amount" value="${highestBid + 1}" class="p-2 border border-gray-300 rounded-md w-full" />
            <button id="submit-bid" class="bg-teal-600 text-white p-2 rounded-md hover:bg-teal-700">Place Bid</button>
        `;

        // Handle place bid button click
        document.getElementById('submit-bid').addEventListener('click', async () => {
            const bidAmount = document.getElementById('bid-amount').value.trim();
            if (bidAmount && !isNaN(bidAmount) && parseFloat(bidAmount) > highestBid) {
                // Prepare the bid data
                const bidData = { amount: parseFloat(bidAmount) };

                try {
                    const response = await fetch(`${API_BASE}/auction/listings/${listingId}/bids`, {
                        method: 'POST',
                        headers: headers(true), 
                        body: JSON.stringify(bidData),
                    });

                    if (!response.ok) {
                        const error = await response.json();
                        console.error('Error placing bid:', error);
                        alert('Failed to place bid: ' + error.message);
                    } else {
                        alert('Bid placed successfully!');
                        location.reload(); 
                    }
                } catch (error) {
                    console.error('Error placing bid:', error);
                    alert('There was an issue placing your bid.');
                }
            } else {
                alert('Please enter a valid bid amount higher than the current winning bid.');
            }
        });
    } else {
        // User is not logged in, show the login/register message instead
        placeBidSection.innerHTML = '<p>Register or login to bid on listing</p>';
    }

    // Add event listener for "Back to Feed" button
    const backToFeedBtn = document.getElementById("backToFeedBtn");
    if (backToFeedBtn) {
        backToFeedBtn.addEventListener("click", function () {
            window.location.href = "/index.html";
        });
    }

    // Add event listener for image clicks in the carousel
    document.querySelectorAll('#listing-images img').forEach((img, index) => {
        img.addEventListener('click', () => {
            // Get the current main image and clicked image
            const mainImage = document.getElementById('listing-main-image').querySelector('img');
            const carouselImages = document.querySelectorAll('#listing-images img');

            // Switch the main image with the clicked image in the carousel
            const clickedImage = carouselImages[index];
            const clickedImageUrl = clickedImage.src;
            const clickedImageAlt = clickedImage.alt;

            // Update the clicked image's src to be the main image's src
            clickedImage.src = mainImage.src;
            clickedImage.alt = mainImage.alt;

            // Update the main image's src to be the clicked image's src
            mainImage.src = clickedImageUrl;
            mainImage.alt = clickedImageAlt;
        });
    });
}

// Fetch user credits from their profile
async function fetchUserCredits() {
    const loggedInUserName = localStorage.getItem('name');
    if (!loggedInUserName) return 0;

    try {
        const response = await fetch(`${API_BASE}/auction/profiles/${loggedInUserName}`, {
            method: 'GET',
            headers: headers(),
        });

        if (response.ok) {
            const data = await response.json();
            return data.data.credits || 0;
        } else {
            throw new Error('Failed to fetch user credits');
        }
    } catch (error) {
        console.error('Error fetching user credits:', error);
        return 0;
    }
}

// Initialize listing details on page load
document.addEventListener("DOMContentLoaded", function () {
    showListing();
});
