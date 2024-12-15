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
        <h2>${listing.title}</h2>
        
        <!-- Display multiple images -->
        <div id="listing-images">
            ${listing.media.map(image => `
                <img src="${image.url}" alt="${image.alt}" class="listing-image" />
            `).join('')}
        </div>
        
        <p><strong>Description:</strong> ${listing.description}</p>
        <p><strong>Created on:</strong> ${new Date(listing.created).toLocaleDateString()}</p>
        <p><strong>Tags:</strong> ${listing.tags.join(', ')}</p>
        <p><strong>Auction ends at:</strong> ${new Date(listing.endsAt).toLocaleString()}</p>
        <p><strong>Bids:</strong> ${listing._count.bids}</p>
        <p><strong>Current Winning Bid:</strong> ${highestBid > 0 ? highestBid : 'No bids yet'}</p>
        <div id="listing-seller">
            <strong>Seller:</strong> <a href="javascript:void(0);" id="seller-name">${sellerName}</a>
        </div>

        <h3>Bidding History:</h3>
        <div id="bidding-history">
            ${listing.bids.length > 0 ? listing.bids.map(bid => `
                <div class="bid">
                    <p>
                        <strong><a href="/profile/?name=${bid.bidder.name}" id="bidder-name-${bid.id}">${bid.bidder.name}</a></strong> placed a bid of ${bid.amount} at ${new Date(bid.created).toLocaleString()}
                    </p>
                </div>
            `).join('') : '<p>No bids yet</p>'}
        </div>


        <h3>Place a Bid:</h3>
        <div id="place-bid">
            <!-- Default content will be set depending on login status -->
        </div>
        <p><strong>Your Credits:</strong> <span id="user-credits">Loading...</span></p>
        <div id="edit-delete-buttons">
            <!-- Buttons for edit and delete will be injected here -->
        </div>
    `;

    // Show edit and delete buttons if the logged-in user is the seller
    if (loggedInUserName === sellerName) {
        const buttonsContainer = document.getElementById('edit-delete-buttons');
        
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit Listing';
        editButton.id = 'editListing';
        editButton.addEventListener('click', () => {
            window.location.href = `/post/edit/edit.html?id=${listingId}`;
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete Listing';
        deleteButton.id = 'deleteListing';
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
            <input type="number" id="bid-amount" placeholder="Enter your bid amount" value="${highestBid + 1}">
            <button id="submit-bid">Place Bid</button>
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
                        headers: headers(true), // Send the access token with the request
                        body: JSON.stringify(bidData),
                    });

                    if (!response.ok) {
                        const error = await response.json();
                        console.error('Error placing bid:', error);
                        alert('Failed to place bid: ' + error.message);
                    } else {
                        alert('Bid placed successfully!');
                        location.reload(); // Reload to show updated bid count, etc.
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
