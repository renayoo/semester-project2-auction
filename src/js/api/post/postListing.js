// postListing.js
import { headers } from '../headers';


document.getElementById("listingForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    // Get the form values
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value || '';  // Optional field
    const tags = document.getElementById("tags").value.split(',').map(tag => tag.trim());  // Split by commas
    const mediaUrl = document.getElementById("mediaUrl").value;
    const endsAt = document.getElementById("endDate").value;

    // Validate required fields
    if (!title || !endsAt) {
        alert("Title and End Date are required!");
        return;
    }

    // Construct the media array if a media URL is provided
    const media = mediaUrl ? [{ url: mediaUrl, alt: "Listing Image" }] : [];

    // Prepare the data object
    const listingData = {
        title: title,
        description: description,
        tags: tags,
        media: media,
        endsAt: new Date(endsAt).toISOString(),  // Ensure endsAt is in ISO format
    };

    // Log the listing data for debugging
    console.log("Listing Data:", listingData);

    // Retrieve the access token from local storage
    const accessToken = localStorage.getItem("accessToken");  // Directly get the accessToken from localStorage
    console.log("Access Token:", accessToken);  // Log the access token

    // If access token is missing, handle the case
    if (!accessToken) {
        alert("Missing access token. Please log in.");
        return;
    }

    try {
        // Use headers from the imported function
        const requestHeaders = headers(true);  // Pass `true` to indicate a body is being sent

        // Make the POST request to the auction API with the full base URL
        const response = await fetch("https://v2.api.noroff.dev/auction/listings", {
            method: "POST",
            headers: requestHeaders,
            body: JSON.stringify(listingData),
        });

        // Handle the response
        if (response.ok) {
            const result = await response.json();
            alert("Listing created successfully!");
            // Optionally reset the form
            document.getElementById("listingForm").reset();
        } else {
            // If response is not ok, log the error and show it
            const error = await response.json();
            console.error("Error Response:", error);  // Log the response body for debugging
            alert("Error: " + error.message);
        }
    } catch (error) {
        // Catch any other errors
        console.error("Error creating listing:", error);
        alert("There was an issue submitting your listing.");
    }
});
