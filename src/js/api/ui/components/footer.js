// Create a function for footer
function loadFooter() {
    // Add the footer HTML
    const footerHTML = `
        <footer class="bg-[#00708E] text-white text-center py-4 w-full">
            <p>&copy; 2024 Auction website. All rights reserved.</p>
        </footer>
    `;

    // Insert the footer into the div with id="footer"
    const footerDiv = document.getElementById('footer');
    if (footerDiv) {
        footerDiv.innerHTML = footerHTML;
    }

    // Apply Flexbox styling to the body
    const body = document.querySelector('body');
    body.classList.add('flex', 'flex-col', 'min-h-screen'); // Ensure body uses the full screen height

    // Ensure the footer stays at the bottom
    const footer = document.querySelector('footer');
    if (footer) {
        footer.classList.add('mt-auto'); // Push footer to the bottom of the page
    }
}

// Wait until the DOM is fully loaded before injecting the footer
document.addEventListener('DOMContentLoaded', loadFooter);
