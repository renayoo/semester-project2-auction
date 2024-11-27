import { API_BASE } from '../../constants.js';
import { headers } from '../../headers.js';


const listingsContainer = document.getElementById('listings');

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

                return `
                    <div class="listing-item">
                        <img src="${mediaUrl}" alt="${mediaAlt}" class="listing-image" />
                        <div class="listing-details">
                            <h3 class="listing-title">${item.title}</h3>
                            <p class="listing-description">${item.description}</p>
                            <p class="listing-tags">Tags: ${item.tags.join(', ')}</p>
                            <p class="listing-end-date">Ends At: ${new Date(item.endsAt).toLocaleString()}</p>
                            <p class="listing-bids">Bids: ${item._count.bids}</p>
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
