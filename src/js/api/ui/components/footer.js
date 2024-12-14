function loadFooter() {
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
}

// Wait until the DOM is fully loaded before injecting the footer
document.addEventListener('DOMContentLoaded', loadFooter);
