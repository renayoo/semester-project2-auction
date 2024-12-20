import { headers } from './api/headers';
import { API_BASE } from './api/constants';

const listingsContainer = document.getElementById('listings');
const paginationContainer = document.querySelector('.pagination');
const searchInput = document.getElementById('search');

// Function to fetch and display the newest listings
async function loadListings() {
    const currentPage = getCurrentPage();

    // Get the search input value from the URL or the input field
    const searchTerm = getSearchTermFromURL() || searchInput.value.trim();

    // Construct API endpoint with search parameters and pagination (limit is 8 listings per page)
    let endpoint = `${API_BASE}/auction/listings?page=${currentPage}&limit=8&sort=created&order=desc&_bids=true`; // Default to newest listings
    if (searchTerm) {
        endpoint = `${API_BASE}/auction/listings/search?q=${encodeURIComponent(searchTerm)}&page=${currentPage}&limit=8&sort=created&order=desc&_bids=true`; // Include search term
    }

    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: headers(),
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch listings: ${response.statusText}`);
        }

        const data = await response.json();
        const { data: listings, meta } = data;

        if (listings && listings.length > 0) {
            // Generate the HTML for the listings
            const listingsHtml = listings.map(item => {
                const mediaUrl = item.media && item.media[0] ? item.media[0].url : 'default-image.jpg';
                const mediaAlt = item.media && item.media[0] ? item.media[0].alt : 'No image available';

                // Check if there are any bids and get the highest bid
                const bids = item.bids && item.bids.length > 0 ? item.bids : [];
                const winningBid = bids.length > 0 ? Math.max(...bids.map(bid => bid.amount)) : null;
                const winningBidText = winningBid !== null ? `$${winningBid.toFixed(2)}` : 'No bids';

                const endsAtTimestamp = new Date(item.endsAt).getTime();

                return `
                    <div class="listing-item bg-white rounded-lg shadow-lg overflow-hidden flex flex-col" data-listing-id="${item.id}">
                        <a href="/listing/index.html?id=${item.id}" class="listing-link block relative">
                            <img src="${mediaUrl}" alt="${mediaAlt}" class="listing-image w-full h-64 object-cover" />
                        </a>
                        <div class="listing-details p-4 flex flex-col flex-grow">
                            <h3 class="listing-title text-xl font-semibold text-gray-800 truncate">${item.title}</h3>
                            <p class="listing-description text-sm text-gray-600 mt-2">${item.description || 'No description available'}</p>
                            <p class="listing-tags text-xs text-gray-500 mt-1">Tags: ${item.tags.length > 0 ? item.tags.join(', ') : 'No tags'}</p>
                            <p class="listing-end-date text-sm text-gray-700 mt-2"><strong>Ending in: </strong><span class="countdown-timer" data-ends-at="${endsAtTimestamp}">Loading...</span></p>
                            <p class="listing-bids text-sm text-gray-700 mt-2">Bids: ${item._count.bids}</p>
                            <p class="listing-winning-bid text-sm text-gray-700 mt-2"><strong>Current Winning Bid: </strong>${winningBidText}</p>
                            <button class="view-listing-button mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200" data-listing-id="${item.id}">View Listing</button>
                        </div>
                    </div>
                `;
            }).join('');

            listingsContainer.innerHTML = listingsHtml;

            // Generate pagination controls
            generatePaginationControls(meta);

            // Add event listeners for listing buttons
            const viewListingButtons = document.querySelectorAll('.view-listing-button');
            viewListingButtons.forEach(button => {
                button.addEventListener('click', handleListingClick);
            });

            const listingImages = document.querySelectorAll('.listing-image');
            listingImages.forEach(image => {
                image.addEventListener('click', handleListingClickFromImage);
            });

            // Initialize countdown timers
            initializeCountdownTimers();
        } else {
            listingsContainer.innerHTML = '<p>No listings available.</p>';
        }
    } catch (error) {
        console.error('Error loading listings:', error);
        listingsContainer.innerHTML = '<p>Failed to load listings. Please try again later.</p>';
    }
}

// Function to get the search term from the URL if present
function getSearchTermFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('q') || '';
}

// Function to handle search or input change
function handleSearch() {
    const searchTerm = searchInput.value.trim();
    // Update the URL with the search term
    const currentUrl = new URL(window.location);
    currentUrl.searchParams.set('q', searchTerm);
    currentUrl.searchParams.set('page', 1); // Reset to page 1 when searching
    history.pushState(null, '', currentUrl.toString());
    loadListings(); // Reload the listings with the new search term
}

// Function to get the current page from the URL
function getCurrentPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const page = parseInt(urlParams.get('page'), 10);
    return isNaN(page) || page <= 0 ? 1 : page;
}

// Function to generate pagination controls
function generatePaginationControls(meta) {
    const { currentPage, pageCount } = meta;

    // Dynamically determine the maxVisiblePages based on screen size
    const maxVisiblePages = window.matchMedia('(max-width: 768px)').matches ? 2 : 5; // 2 buttons for phones, 5 for larger screens

    paginationContainer.innerHTML = '';

    // Calculate the range of pages to display
    let startPage = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, pageCount);

    // Adjust startPage if the endPage goes beyond pageCount
    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    // Create "Previous" button
    if (currentPage > 1) {
        const prevButton = document.createElement('a');
        prevButton.href = `?page=${currentPage - 1}`;
        prevButton.classList.add('pagination-button');
        prevButton.textContent = 'Previous';
        paginationContainer.appendChild(prevButton);
    }

    // Create page buttons
    for (let page = startPage; page <= endPage; page++) {
        const pageButton = document.createElement('a');
        pageButton.href = `?page=${page}`;
        pageButton.classList.add('pagination-button');
        pageButton.textContent = page;

        if (page === currentPage) {
            pageButton.classList.add('active');
        }

        paginationContainer.appendChild(pageButton);
    }

    // Create "Next" button
    if (currentPage < pageCount) {
        const nextButton = document.createElement('a');
        nextButton.href = `?page=${currentPage + 1}`;
        nextButton.classList.add('pagination-button');
        nextButton.textContent = 'Next';
        paginationContainer.appendChild(nextButton);
    }
}

// Function to initialize countdown timers
function initializeCountdownTimers() {
    const timers = document.querySelectorAll('.countdown-timer');

    timers.forEach(timer => {
        const endsAt = parseInt(timer.getAttribute('data-ends-at'), 10);

        function updateTimer() {
            const now = Date.now();
            const timeLeft = endsAt - now;

            if (timeLeft <= 0) {
                timer.textContent = "Expired";
                timer.closest('.listing-item').classList.add('expired');
                return;
            }

            if (timeLeft > 24 * 60 * 60 * 1000) {
                const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
                timer.textContent = `${days} day${days > 1 ? 's' : ''} left`;
            } else {
                const hours = Math.floor(timeLeft / (1000 * 60 * 60));
                const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
                timer.textContent = `${hours}h ${minutes}m ${seconds}s`;
            }
        }

        updateTimer(); // Run immediately
        setInterval(updateTimer, 1000); // Update every second
    });
}

// Function to handle listing click navigation
function handleListingClick(event) {
    event.preventDefault();
    const listingId = event.currentTarget.getAttribute('data-listing-id');
    navigateToListing(listingId);
}

// Function to handle listing click navigation from the image
function handleListingClickFromImage(event) {
    event.preventDefault();
    const listingId = event.currentTarget.closest('.listing-item').getAttribute('data-listing-id');
    navigateToListing(listingId);
}

// Function to navigate to a specific listing
function navigateToListing(listingId) {
    window.location.href = `/listing/index.html?id=${listingId}`;
}

// Event listener for the search input
searchInput.addEventListener('input', handleSearch);

// Load listings on page load
document.addEventListener('DOMContentLoaded', () => {
    const searchTermFromURL = getSearchTermFromURL();
    if (searchTermFromURL) {
        searchInput.value = searchTermFromURL;
    }
    loadListings();
});
