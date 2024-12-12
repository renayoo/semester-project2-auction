import { headers } from './api/headers';  // Import your headers for the API request 
import { API_BASE } from './api/constants';  // Your API base URL

const listingsContainer = document.getElementById('listings');
const paginationContainer = document.querySelector('.pagination');  // Container for pagination controls

// Get the current page from the URL, default to page 1 if not provided
function getCurrentPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const page = parseInt(urlParams.get('page'), 10);
    return isNaN(page) || page <= 0 ? 1 : page;
}

// Function to fetch listings and display the 9 newest per page
async function loadListings() {
    const currentPage = getCurrentPage();
    
    try {
        const response = await fetch(`${API_BASE}/auction/listings?page=${currentPage}`, {
            method: 'GET',
            headers: headers(),
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch listings: ${response.statusText}`);
        }

        const data = await response.json();
        const { data: listings, meta } = data;

        // Log the fetched data for debugging
        console.log("Fetched Listings Data:", listings);

        if (listings && listings.length > 0) {
            // Sort listings by 'created' date (newest first)
            const sortedListings = listings.sort((a, b) => new Date(b.created) - new Date(a.created));

            // Generate the HTML for the latest listings
            const listingsHtml = sortedListings.slice(0, 9).map(item => {
                const mediaUrl = item.media && item.media[0] ? item.media[0].url : 'default-image.jpg';
                const mediaAlt = item.media && item.media[0] ? item.media[0].alt : 'No image available';

                return `
                    <div class="listing-item" data-listing-id="${item.id}">
                        <a href="#" class="listing-link">
                            <img src="${mediaUrl}" alt="${mediaAlt}" class="listing-image" />
                        </a>
                        <div class="listing-details">
                            <h3 class="listing-title">${item.title}</h3>
                            <p class="listing-description">${item.description || 'No description available'}</p>
                            <p class="listing-tags">Tags: ${item.tags.length > 0 ? item.tags.join(', ') : 'No tags'}</p>
                            <p class="listing-end-date">Ends At: ${new Date(item.endsAt).toLocaleString()}</p>
                            <p class="listing-bids">Bids: ${item._count.bids}</p>
                            <button class="view-listing-button" data-listing-id="${item.id}">View Listing</button> <!-- View Listing Button -->
                        </div>
                    </div>
                `;
            }).join(''); 

            listingsContainer.innerHTML = listingsHtml;

            // Generate pagination controls based on total pages and current page
            generatePaginationControls(meta);
            
            // Add event listeners for listing buttons (View Listing)
            const viewListingButtons = document.querySelectorAll('.view-listing-button');
            viewListingButtons.forEach(button => {
                button.addEventListener('click', handleListingClick);
            });

            // Add event listeners for images
            const listingImages = document.querySelectorAll('.listing-image');
            listingImages.forEach(image => {
                image.addEventListener('click', handleListingClickFromImage);
            });
        } else {
            listingsContainer.innerHTML = '<p>No listings available.</p>';
        }
    } catch (error) {
        console.error('Error loading listings:', error);
        listingsContainer.innerHTML = '<p>Failed to load listings. Please try again later.</p>';
    }
}

// Function to handle the listing click navigation from the button
function handleListingClick(event) {
    event.preventDefault();  // Prevent default button behavior
    const listingId = event.currentTarget.getAttribute('data-listing-id');
    if (listingId) {
        navigateToListing(listingId);
    }
}

// Function to handle the listing click navigation from the image
function handleListingClickFromImage(event) {
    event.preventDefault();  // Prevent default link behavior
    const listingId = event.currentTarget.closest('.listing-item').getAttribute('data-listing-id');
    if (listingId) {
        navigateToListing(listingId);
    }
}

// Function to handle the navigation when clicking on a listing
function navigateToListing(listingId) {
    window.location.href = `/listing/index.html?id=${listingId}`;
}

// Function to generate pagination controls
function generatePaginationControls(meta) {
    const { currentPage, pageCount } = meta;

    // Clear the previous pagination controls
    paginationContainer.innerHTML = '';

    // Add 'Previous' button if not on the first page
    if (currentPage > 1) {
        const prevButton = document.createElement('a');
        prevButton.href = `?page=${currentPage - 1}`;
        prevButton.classList.add('pagination-button');
        prevButton.textContent = 'Previous';
        paginationContainer.appendChild(prevButton);
    }

    // Add page number buttons
    for (let page = 1; page <= pageCount; page++) {
        const pageButton = document.createElement('a');
        pageButton.href = `?page=${page}`;
        pageButton.classList.add('pagination-button');
        pageButton.textContent = page;

        // Highlight the current page
        if (page === currentPage) {
            pageButton.classList.add('active');
        }

        paginationContainer.appendChild(pageButton);
    }

    // Add 'Next' button if not on the last page
    if (currentPage < pageCount) {
        const nextButton = document.createElement('a');
        nextButton.href = `?page=${currentPage + 1}`;
        nextButton.classList.add('pagination-button');
        nextButton.textContent = 'Next';
        paginationContainer.appendChild(nextButton);
    }
}

// Load listings when the page content is fully loaded
document.addEventListener('DOMContentLoaded', loadListings);
