import { headers } from '../headers';

// Function to fetch the profile based on name from URL parameter
async function fetchProfile() {
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('name');

    if (!name) {
        console.error("No name found in the URL");
        return;
    }

    try {
        // Make an API request to fetch the profile using the name
        const response = await fetch(`https://v2.api.noroff.dev/auction/profiles/${name}`, {
            method: "GET",
            headers: headers(),
        });

        if (!response.ok) {
            throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        const profile = data.data;

        // Update the profile information in the DOM
        document.getElementById('banner').src = profile.banner?.url || '';
        document.getElementById('avatar').src = profile.avatar?.url || '';
        document.getElementById('name').textContent = profile.name;
        document.getElementById('email').textContent = profile.email;
        document.getElementById('bio').textContent = profile.bio || 'No bio available';
        document.getElementById('credits').textContent = profile.credits;
        document.getElementById('listings-count').textContent = profile._count.listings || 0;
        document.getElementById('wins-count').textContent = profile._count.wins || 0;
        
        // Add event listener to the edit profile button to redirect to the edit page
        const editProfileBtn = document.getElementById('edit-profile-btn');
        if (editProfileBtn) {
            editProfileBtn.addEventListener('click', function () {
                // Redirect to the edit page with the 'name' query parameter
                window.location.href = `/profile/edit.html?name=${profile.name}`;
            });
        }

    } catch (error) {
        console.error("Error fetching profile:", error);
        document.getElementById('profile-container').innerHTML = '<p>Error loading profile. Please try again later.</p>';
    }
}

// Wait until the DOM is loaded to fetch the profile
document.addEventListener('DOMContentLoaded', fetchProfile);
