document.addEventListener('DOMContentLoaded', () => {
    const feedContainer = document.getElementById('feed-container');
    const exploreContainer = document.getElementById('explore-container');
    const profileContainer = document.getElementById('profile-container');
    const uploadForm = document.getElementById('upload-form');
    const monthlyChallengesContainer = document.getElementById('challenges-container');

    // Load routines if necessary
    if (feedContainer || exploreContainer || profileContainer) {
        loadRoutines(feedContainer, exploreContainer, profileContainer);
    }

    // Load users for the explore page
    const searchInput = document.getElementById('user-search');
    if (searchInput) {
        loadUsers(searchInput);
    }

    // Handle routine uploads
    if (uploadForm) {
        handleRoutineUpload(uploadForm);
    }

    // Load user profile if on profile page
    if (profileContainer) {
        loadUserProfile();
    }

    // Load monthly challenges if on the challenges page
    if (monthlyChallengesContainer) {
        loadChallenges();  // Ensure this function is available in `challenges.js`
    }

});