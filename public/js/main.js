document.addEventListener('DOMContentLoaded', () => {
    const feedContainer = document.getElementById('feed-container');
    const exploreContainer = document.getElementById('explore-container');
    const profileContainer = document.getElementById('profile-container');
    const uploadForm = document.getElementById('upload-form');
    const aiForm = document.getElementById('ai-form');

    // User Data and User Loading

    // Simulated user data (replace with real data from backend)
    const userData = {
        name: "John Doe",
        username: "john_doe",
        bio: "Fitness enthusiast and trainer. Sharing daily routines to stay fit!",
        followers: 128,
        following: 80,
        routines: [
            { title: "Full Body Workout", description: "A complete routine to work your entire body." },
            { title: "Leg Day Special", description: "An intense leg workout to build strength." },
            { title: "Cardio Blast", description: "A quick cardio routine to boost stamina." },
            { title: "Abs and Core", description: "Focus on core strength with this ab routine." }
        ]
    };

    const users = [
        { id: 1, name: "John Doe", username: "john_doe" },
        { id: 2, name: "Jane Smith", username: "jane_smith" },
        { id: 3, name: "Chris Johnson", username: "chris_j" },
        { id: 4, name: "Laura Adams", username: "laura_fitness" }
    ];
    
    // Utility function to create user card
    const userCard = (user) => `
        <div class="col-md-4">
            <div class="card h-100">
                <div class="card-body">
                    <h5 class="card-title">${user.name}</h5>
                    <p class="card-text">@${user.username}</p>
                    <a href="profile.html?user=${user.username}" class="btn btn-primary">View Profile</a>
                </div>
            </div>
        </div>
    `;  

    // Function to display users
    const loadUsers = (searchTerm = '') => {
        const userContainer = document.getElementById('user-container');
        if (!userContainer) return;

        userContainer.innerHTML = '';  // Clear previous results

        users
            .filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            user.username.toLowerCase().includes(searchTerm.toLowerCase()))
            .forEach(user => {
                userContainer.innerHTML += userCard(user);
            });
    };

    // Search functionality for users on the Explore page
    const searchInput = document.getElementById('user-search');
    if (searchInput) {
        // Initial load of all users
        loadUsers();

        // Add an event listener for search input
        searchInput.addEventListener('input', (event) => {
            const searchTerm = event.target.value;
            loadUsers(searchTerm);
        });
    }

    // Loading Routines

    // Simulated routines data (in a real scenario, you'd fetch this from an API)
    const routines = [
        { title: "Full Body Workout", description: "A complete routine to work your entire body." },
        { title: "Leg Day Special", description: "An intense leg workout to build strength." },
        { title: "Cardio Blast", description: "A quick cardio routine to boost stamina." },
        { title: "Abs and Core", description: "Focus on core strength with this ab routine." },
        { title: "Upper Body Strength", description: "A great upper-body workout." },
        { title: "Yoga Flexibility", description: "A relaxing routine to improve flexibility." },
        { title: "HIIT Quick Burn", description: "Short but effective HIIT session." },
        { title: "Stretch and Recover", description: "A light routine focused on recovery." }
        // Add more routines as necessary
    ];

    // Update profile info
    document.getElementById('profile-name').textContent = userData.name;
    document.getElementById('profile-username').textContent = userData.username;
    document.getElementById('profile-bio').textContent = userData.bio;
    document.getElementById('followers-count').textContent = userData.followers;
    document.getElementById('following-count').textContent = userData.following;
    document.getElementById('post-count').textContent = userData.routines.length;
 

    // Utility function to create a card layout for routines
    const routineCard = (routine) => `
        <div class="col-md-4">
            <div class="card h-100">
                <div class="card-body">
                    <h5 class="card-title">${routine.title}</h5>
                    <p class="card-text">${routine.description}</p>
                    <button class="btn btn-primary">Follow</button>
                </div>
            </div>
        </div>
    `;

    userData.routines.forEach(routine => {
        profileContainer.innerHTML += routineCard(routine);
    });

    // Fetch and display routines for Feed, Explore, and Profile
    const loadRoutines = () => {
        fetch('/api/routines')
            .then(response => response.json())
            .then(data => {
                data.forEach(routines => {
                    const cardHTML = routineCard(routines);
                    // Append card to the appropriate container if it exists
                    if (feedContainer) feedContainer.innerHTML += cardHTML;
                    if (exploreContainer) exploreContainer.innerHTML += cardHTML;
                    if (profileContainer) profileContainer.innerHTML += cardHTML;
                });
            })
            .catch(error => console.error('Error fetching routines:', error));
    };

    // Load routines on page load if the feed, explore, or profile containers exist
    if (feedContainer || exploreContainer || profileContainer) {
        loadRoutines();
    }

    // Uploading a Routine

    // Handle routine upload
    if (uploadForm) {
        uploadForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const title = document.getElementById('title').value;
            const description = document.getElementById('description').value;

            // Basic validation
            if (!title || !description) {
                alert('Please fill in both fields.');
                return;
            }

            // Send the new routine to the server
            fetch('/api/routines', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description })
            })
                .then(response => response.json())
                .then(data => {
                    alert('Routine uploaded successfully!');
                    uploadForm.reset(); // Clear the form after submission
                    // Optionally refresh the feed or explore page to show the new routine
                    if (feedContainer || exploreContainer) loadRoutines();
                })
                .catch(error => {
                    console.error('Error uploading routine:', error);
                    alert('Failed to upload routine. Please try again.');
                });
        });
    }

    // Loading Profile Data

    // Function to get query parameter from URL (for user profiles)
    const getQueryParam = (param) => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    };

    // Load user's profile data
    const loadUserProfile = () => {
        const username = getQueryParam('user');
        if (!username) return;

        const user = users.find(u => u.username === username);
        if (!user) {
            alert('User not found');
            return;
        }

        // Update profile details
        const profileName = document.getElementById('profile-name');
        const profileUsername = document.getElementById('profile-username');
        const profileUsernameHeader = document.getElementById('profile-username-header');

        profileName.textContent = user.name;
        profileUsername.textContent = user.username;
        profileUsernameHeader.textContent = user.name;

        // Load user's routines
        loadRoutines();
    };

    // Load the profile if on the profile page
    if (document.getElementById('profile-container')) {
        loadUserProfile();
    }

    // AI Assistant

    // Handle AI assistant form submission
    if (aiForm) {
        aiForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const question = document.getElementById('question').value;
            const responseDiv = document.getElementById('ai-response');

            if (!question) {
                alert('Please enter a question.');
                return;
            }

            try {
                const response = await fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer YOUR_OPENAI_API_KEY`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        prompt: question,
                        max_tokens: 100
                    })
                });

                const data = await response.json();
                const answer = data.choices[0].text.trim();
                responseDiv.innerHTML = `<p><strong>AI Response:</strong> ${answer}</p>`;
            } catch (error) {
                console.error('Error fetching AI response:', error);
                responseDiv.innerHTML = `<p>There was an error. Please try again later.</p>`;
            }
        });
    }
});

