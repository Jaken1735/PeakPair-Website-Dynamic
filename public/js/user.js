document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('user-search');
    const userContainer = document.getElementById('user-container');
    let users = [];  // This will hold all trainers fetched from the backend

    // Arrays of image paths for male and female users
    const maleImages = [
        "/assets/trainers/male/trainer1_m.png",
        "/assets/trainers/male/trainer2_m.png",
        "/assets/trainers/male/trainer3_m.png",
        "/assets/trainers/male/trainer4_m.png",
        "/assets/trainers/male/trainer5_m.png"
    ];

    const femaleImages = [
        "/assets/trainers/female/trainer1_f.png",
        "/assets/trainers/female/trainer2_f.png",
        "/assets/trainers/female/trainer3_f.png",
        "/assets/trainers/female/trainer4_f.png",
        "/assets/trainers/female/trainer5_f.png"
    ];

    // Utility function to get a random image based on gender
    const getRandomImage = (gender) => {
        const images = gender === 'Female' ? femaleImages : maleImages;
        const randomIndex = Math.floor(Math.random() * images.length);
        return images[randomIndex];
    };

    // Utility function to create user card with a gender-appropriate random image
    const userCard = (user) => `
        <div class="col-md-4 mb-4">
            <div class="card h-100 text-center">
                <div class="card-body d-flex flex-column justify-content-between align-items-center p-3">
                    <div class="profile-pic-container mb-3">
                        <img src="${getRandomImage(user.gender)}" class="rounded-circle profile-pic" alt="${user.name}'s Profile Picture" style="width: 80px; height: 80px; object-fit: cover;">
                    </div>
                    <div class="user-info">
                        <h5 class="card-title mb-1">${user.name}</h5>
                        <p class="card-text">${user.geographic_area}</p>
                        <p class="card-text text-muted mb-2">Trainer-ID: ${user.trainer_id}</p>
                        <a href="trainer_profile.html?id=${user.trainer_id}" class="btn btn-primary btn-sm">View Profile</a>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Helper function to display a limited number of users
    const displayUsers = (container, users, limit = 6) => {
        container.innerHTML = '';  // Clear previous content
        users.slice(0, limit).forEach(user => {
            container.innerHTML += userCard(user);
        });
    };

    // Function to fetch all users from the backend
    const fetchAllUsers = () => {
        fetch('http://127.0.0.1:5000/all-trainers')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error: ${response.status} - ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                users = data;  // Store all users in `users`
                displayUsers(userContainer, users);  // Display only the first 6 users initially
            })
            .catch(error => console.error('Error fetching all trainers:', error));
    };

    // Function to handle search functionality
    const handleSearch = (searchTerm) => {
        const filteredUsers = users.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.location && user.location.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        displayUsers(userContainer, filteredUsers);  // Display all matching results
    };

    // Initialize users and search functionality
    const initialize = () => {
        if (!userContainer) return;  // Ensure the container exists

        // Fetch and display the first 6 users initially
        fetchAllUsers();

        // Handle search functionality
        if (searchInput) {
            searchInput.addEventListener('input', (event) => {
                const searchTerm = event.target.value.trim();
                if (searchTerm) {
                    handleSearch(searchTerm);  // Display all matching users if there is a search term
                } else {
                    displayUsers(userContainer, users);  // Display the first 6 users if search term is cleared
                }
            });
        }
    };

    // Load users on page load if `userContainer` exists
    if (userContainer) {
        initialize();
    }
});


