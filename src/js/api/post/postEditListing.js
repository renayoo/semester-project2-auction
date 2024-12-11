import { API_BASE } from "../constants"; 
import { headers } from '../headers.js';

// Function to fetch the listing details by ID
async function fetchListingById(listingId) {
    try {
        const response = await fetch(`${API_BASE}/auction/listings/${listingId}`, {
            method: 'GET',
            headers: headers() 
        });

        if (!response.ok) {
            throw new Error('Failed to fetch listing data');
        }

        const data = await response.json();
        console.log('Fetched listing data:', data); // Debugging: Log fetched data
        return data.data; // Return the listing data
    } catch (error) {
        console.error('Error fetching listing:', error);
        alert('Error fetching listing data');
    }
}

// Function to update the listing
async function updateListing(listingId, updatedData) {
    try {
        const response = await fetch(`${API_BASE}/auction/listings/${listingId}`, {
            method: 'PUT',
            headers: headers(), // Use headers function for authentication
            body: JSON.stringify(updatedData)
        });

        if (!response.ok) {
            throw new Error('Failed to update listing');
        }

        alert('Listing updated successfully!');
        window.location.href = `/listing/${listingId}`; // Redirect after successful update
    } catch (error) {
        console.error('Error updating listing:', error);
        alert('Failed to update listing: ' + error.message);
    }
}

// Function to delete the listing
async function deleteListing(listingId) {
    const confirmation = confirm('Are you sure you want to delete this listing?');
    if (!confirmation) return;

    try {
        const response = await fetch(`${API_BASE}/auction/listings/${listingId}`, {
            method: 'DELETE',
            headers: headers() 
        });

        if (!response.ok) {
            throw new Error('Failed to delete listing');
        }

        alert('Listing deleted successfully!');
        window.location.href = '/'; // Redirect to homepage after deletion
    } catch (error) {
        console.error('Error deleting listing:', error);
        alert('Failed to delete listing: ' + error.message);
    }
}

// Initialize the page with the listing data
async function initializeEditPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const listingId = urlParams.get('id');
    
    if (!listingId) {
        alert('No listing ID provided.');
        return;
    }

    console.log('Listing ID:', listingId); // Debugging: Log listing ID

    const listingData = await fetchListingById(listingId);
    
    if (!listingData) {
        alert('Listing not found.');
        return;
    }

    // Pre-populate the form fields with the current listing data
    document.getElementById('title').value = listingData.title || ''; // Default to empty if not available
    document.getElementById('description').value = listingData.description || ''; // Default to empty if not available
    document.getElementById('tags').value = listingData.tags ? listingData.tags.join(', ') : ''; // Join tags if available, otherwise empty

    // Pre-populate media URLs
    const mediaContainer = document.getElementById('mediaContainer');
    if (listingData.media && listingData.media.length > 0) {
        listingData.media.forEach((media, index) => {
            const mediaDiv = document.createElement('div');
            mediaDiv.classList.add('media-input');

            const mediaUrlInput = document.createElement('input');
            mediaUrlInput.type = 'url';
            mediaUrlInput.classList.add('mediaUrl');
            mediaUrlInput.value = media.url || ''; // Default to empty if not available
            mediaDiv.appendChild(mediaUrlInput);

            const mediaAltInput = document.createElement('input');
            mediaAltInput.type = 'text';
            mediaAltInput.classList.add('mediaAlt');
            mediaAltInput.value = media.alt || ''; // Default to empty if not available
            mediaDiv.appendChild(mediaAltInput);

            const removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.textContent = 'Remove';
            removeBtn.classList.add('removeImageBtn');
            removeBtn.addEventListener('click', () => {
                mediaDiv.remove();
            });
            mediaDiv.appendChild(removeBtn);

            mediaContainer.appendChild(mediaDiv);
        });
    } else {
        console.log('No media available for this listing.');
    }

    // Pre-populate end date
    if (listingData.endsAt) {
        document.getElementById('endDate').value = new Date(listingData.endsAt).toISOString().slice(0, 16);
    } else {
        console.log('End date not available for this listing.');
    }

    // Add event listener for form submission
    document.getElementById('listingForm').addEventListener('submit', (event) => {
        event.preventDefault();

        const updatedData = {
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            tags: document.getElementById('tags').value.split(',').map(tag => tag.trim()),
            media: Array.from(document.querySelectorAll('.media-input')).map((mediaInput) => {
                return {
                    url: mediaInput.querySelector('.mediaUrl').value,
                    alt: mediaInput.querySelector('.mediaAlt').value,
                };
            }),
            endsAt: document.getElementById('endDate').value
        };

        updateListing(listingId, updatedData);
    });

    // Add event listener for delete button
    document.getElementById('deleteButton').addEventListener('click', () => {
        deleteListing(listingId);
    });
}

// Initialize the page when it's loaded
document.addEventListener('DOMContentLoaded', initializeEditPage);
