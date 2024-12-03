import { headers } from '../headers';

document.getElementById("listingForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    // Get the form values
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value || '';  // Optional field
    const tags = document.getElementById("tags").value.split(',').map(tag => tag.trim());  // Split by commas
    const mediaUrls = document.querySelectorAll('.mediaUrl'); // Get all media URL input elements
    const media = [];

    // Loop through media inputs and collect URLs
    mediaUrls.forEach(input => {
        const url = input.value.trim();
        if (url) {
            media.push({ url: url, alt: "Listing Image" });
        }
    });

    const endsAt = document.getElementById("endDate").value;

    // Validate required fields
    if (!title || !endsAt) {
        alert("Title and End Date are required!");
        return;
    }

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

// Add event listener for adding new image inputs
document.getElementById("addImageBtn").addEventListener("click", function() {
    const mediaContainer = document.getElementById("mediaContainer");
    const newInput = document.createElement("div");
    newInput.classList.add("media-input");
    newInput.innerHTML = `
        <input type="url" class="mediaUrl" name="mediaUrl[]" placeholder="Image URL">
        <button type="button" class="removeImageBtn">Remove</button>
    `;
    mediaContainer.appendChild(newInput);
});

// Add event listener for removing image inputs
document.getElementById("mediaContainer").addEventListener("click", function(event) {
    if (event.target.classList.contains("removeImageBtn")) {
        const inputContainer = event.target.parentElement;
        inputContainer.remove();
    }
});
