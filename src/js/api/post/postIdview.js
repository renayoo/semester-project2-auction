import { API_BASE } from "../constants"; 
import { headers } from '../headers.js';

// Function to fetch listing data by ID
async function fetchListingById(listingId) {
    try {
        const response = await fetch(`${API_BASE}/auction/listings/${listingId}?_seller=true&_bids=true`, {
            method: 'GET',
            headers: headers(), // Use the headers function for authentication
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
            headers: headers(), // Use headers function for authentication
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
    const listingId = urlParams.get('id'); // Get listing ID from URL parameters

    if (!listingId) {
        listingDetailsContainer.innerHTML = '<h2>No listing ID specified.</h2>';
        return;
    }

    const listing = await fetchListingById(listingId);

    if (!listing) {
        listingDetailsContainer.innerHTML = '<h2>Listing not found.</h2>';
        return;
    }

    // Access the seller's name (assuming the seller is an object with a name property)
    const sellerName = listing.seller && listing.seller.name ? listing.seller.name : 'Unknown Seller';
    const loggedInUserName = localStorage.getItem('name'); // Assuming this is saved in localStorage

    // Populate listing details
    listingDetailsContainer.innerHTML = `
        <h2>${listing.title}</h2>
        ${listing.media && listing.media.length > 0 ? `<img src="${listing.media[0].url}" alt="${listing.media[0].alt}" />` : ''}
        <p><strong>Description:</strong> ${listing.description}</p>
        <p><strong>Created on:</strong> ${new Date(listing.created).toLocaleDateString()}</p>
        <p><strong>Last Updated on:</strong> ${new Date(listing.updated).toLocaleDateString()}</p>
        <p><strong>Tags:</strong> ${listing.tags.join(', ')}</p>
        <p><strong>Auction ends at:</strong> ${new Date(listing.endsAt).toLocaleString()}</p>
        <p><strong>Bids:</strong> ${listing._count.bids}</p>
        <div id="listing-seller">
            <strong>Seller:</strong> <a href="javascript:void(0);" id="seller-name">${sellerName}</a>
        </div>
        <h3>Place a Bid:</h3>
        <div id="place-bid">
            <!-- Default content will be set depending on login status -->
        </div>
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
        // User is logged in, show the bid input and button
        placeBidSection.innerHTML = `
            <input type="number" id="bid-amount" placeholder="Enter your bid amount">
            <button id="submit-bid">Place Bid</button>
        `;

        // Handle place bid button click
        document.getElementById('submit-bid').addEventListener('click', async () => {
            const bidAmount = document.getElementById('bid-amount').value.trim();
            if (bidAmount && !isNaN(bidAmount)) {
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
                        const bidResult = await response.json();
                        alert(`Bid placed successfully! Bid ID: ${bidResult.data.id}`);
                        // Optionally, refresh the page or update the listing info after placing the bid
                        location.reload(); // Reload to show updated bid count, etc.
                    }
                } catch (error) {
                    console.error('Error placing bid:', error);
                    alert('There was an issue placing your bid.');
                }
            } else {
                alert('Please enter a valid bid amount.');
            }
        });
    } else {
        // User is not logged in, show the login/register message instead
        placeBidSection.innerHTML = '<p>Register or login to bid on listing</p>';
    }

    // Event listener back to feed
    document.getElementById("backToFeedBtn").addEventListener("click", function() {
        window.location.href = "/";
    });
}

// Initialize listing details on page load
document.addEventListener("DOMContentLoaded", function () {
    showListing(); 
});
