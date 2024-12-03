import { headers } from '../headers'; 

// Function to fetch the profile 
async function fetchProfile() {
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('name'); 

    if (!name) {
        console.error("No name found in the URL");
        return;
    }

    try {
        // Make an API request name
        const response = await fetch(`https://v2.api.noroff.dev/auction/profiles/${name}`, {
            method: "GET",
            headers: headers(), 
        });

        if (!response.ok) {
            throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        const profile = data.data;

        // Log the profile data to confirm it's being fetched correctly
        console.log("Fetched profile data:", profile);
        
        
        // Prepopulate the form with the current profile data
        document.getElementById('bio').value = profile.bio || '';
        document.getElementById('avatar-url').value = profile.avatar?.url || '';
        document.getElementById('banner-url').value = profile.banner?.url || '';
    } catch (error) {
        console.error("Error fetching profile:", error);
        document.getElementById('edit-profile-container').innerHTML = '<p>Error loading profile. Please try again later.</p>';
    }
}

// Function to update the profile
async function updateProfile(name, data) {
    // Retrieve the access token from localStorage
    const accessToken = localStorage.getItem('accessToken');  // Get access token from localStorage
    console.log("Access Token:", accessToken);  // Log the access token for debugging
    console.log("Updating profile with data:", data);

    if (!accessToken) {
        console.error("No access token found. You must be logged in.");
        alert("You must be logged in to update your profile.");
        return;
    }

    try {
        const response = await fetch(`https://v2.api.noroff.dev/auction/profiles/${name}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`, 
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            // Log the full response body for debugging
            const errorData = await response.json();
            console.error('Error response from server:', errorData);
            alert(`Error: ${errorData.errors[0]?.message || 'Profile update failed'}`);
            throw new Error('Profile update failed');
        }

        const result = await response.json();
        console.log('Profile updated:', result);
        alert('Profile updated successfully!');
        // Redirect back to profile page after updating
        window.location.href = `/profile/index.html?name=${name}`; 
    } catch (error) {
        console.error('Error updating profile:', error);
        alert('Error updating profile. Please try again later.');
    }
}


// Wait for the DOM to load, then fetch the profile
document.addEventListener('DOMContentLoaded', fetchProfile);

// Handle form submission to update profile
document.getElementById('edit-profile-form').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent default form submission

    // Get values from the form fields
    const bio = document.getElementById('bio').value;
    const avatarUrl = document.getElementById('avatar-url').value;
    const bannerUrl = document.getElementById('banner-url').value;

    // Construct the data object to send to the API
    const profileData = {
        bio: bio || undefined,
        avatar: {
            url: avatarUrl || undefined
        },
        banner: {
            url: bannerUrl || undefined
        }
    };

    // Log the profile data to be sent to the API
    console.log("Profile data being sent to API:", profileData);

    // Remove undefined properties from the data object
    Object.keys(profileData).forEach(key => {
        if (profileData[key] === undefined) {
            delete profileData[key];
        }
    });

    // Get the name from the URL query parameter
    const name = new URLSearchParams(window.location.search).get('name');

    if (!name) {
        alert('User not found');
        return;
    }

    // Update the profile via the API
    updateProfile(name, profileData);
});

