export const API_KEY = "4de79ef0-5e26-4d1b-8a61-9e6e653eb26b"; 
export const API_BASE = "https://v2.api.noroff.dev"; 

// Authentication endpoints 
export const API_AUTH = `${API_BASE}/auth`;
export const API_AUTH_LOGIN = `${API_AUTH}/login`;
export const API_AUTH_REGISTER = `${API_AUTH}/register`;
export const API_AUTH_KEY = `${API_AUTH}/create-api-key`;

// Auction-related endpoints
export const API_AUCTION = `${API_BASE}/auction`;
export const API_AUCTION_LISTINGS = `${API_AUCTION}/listings`;  // Fetch all listings
export const API_AUCTION_LISTINGS_ID = (id) => `${API_AUCTION}/listings/${id}`; // Fetch a single listing by ID
export const API_AUCTION_LISTINGS_SEARCH = `${API_AUCTION}/listings/search`; // Search listings by title or description

// Creating, updating, and deleting listings
export const API_AUCTION_CREATE_LISTING = `${API_AUCTION}/listings`; // Create a new listing
export const API_AUCTION_UPDATE_LISTING = (id) => `${API_AUCTION}/listings/${id}`; // Update a specific listing
export const API_AUCTION_DELETE_LISTING = (id) => `${API_AUCTION}/listings/${id}`; // Delete a specific listing

// Bidding on listings
export const API_AUCTION_BID_LISTING = (id) => `${API_AUCTION}/listings/${id}/bids`; // Place a bid on a listing

// Optional query parameters
export const API_QUERY_ACTIVE = "_active=true"; // Filter for active listings
export const API_QUERY_TAG = "_tag="; // Filter by tag
