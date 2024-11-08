document.addEventListener('DOMContentLoaded', () => {
    const challengesContainer = document.getElementById('challenges-container');
    const challenges = [
        {
            id: 1,
            title: "Maximize your Cross-Fit training",
            description: "Challenge yourself by trying out a personal trainer specialized in Cross-Fit training.",
            status: "View Challenge",
            progress: 50
        },
        {
            id: 2,
            title: "Recommend your favorite <3",
            description: "Show your support by recommending your favorite personal trainer from last month.",
            status: "View Challenge",
            progress: 100
        },
        {
            id: 3,
            title: "Help newcomers!",
            description: "Give new personal trainers a boost by trying them out :)",
            status: "View Challenge",
            progress: 33
        },
        {
            id: 4,
            title: "Expand your mindfulness",
            description: "Try a personal trainer specialized in Yoga!",
            status: "View Challenge",
            progress: 20
        },
    ];

    // Function to create a challenge card
    const challengeCard = (challenge) => `
        <div class="col-md-6 col-lg-4 col-sm-12">
            <div class="challenge-card d-flex flex-column h-100">
                <h5 class="mb-3">${challenge.title}</h5>
                <p class="mb-4">${challenge.description}</p>
    
                <!-- Flex Spacer -->
                <div class="mt-auto">
                    <!-- Progress bar -->
                    <div class="progress mb-3" style="height: 10px;">
                        <div class="progress-bar ${challenge.progress === 100 ? 'completed' : ''}" role="progressbar" 
                            style="width: ${challenge.progress}%;" aria-valuenow="${challenge.progress}" aria-valuemin="0" aria-valuemax="100">
                            ${challenge.progress === 100 ? "Complete" : `${challenge.progress}%`}
                        </div>
                    </div>
    
                    <!-- View Challenge button -->
                    <button type="button" class="btn btn-challenge w-100 view-challenge-btn" data-id="${challenge.id}">
                        ${challenge.status}
                    </button>
                </div>
            </div>
        </div>
    `;


    // Function to load and display challenges
    const loadChallenges = () => {
        challengesContainer.innerHTML = challenges.map(challenge => challengeCard(challenge)).join('');

        // Add event listeners to all "View Challenge" buttons
        document.querySelectorAll('.view-challenge-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault(); // Prevent default behavior
                const challengeId = event.currentTarget.getAttribute('data-id');
                // Redirect to the challenge details page with the challenge ID in the URL
                window.location.href = `challenges_details.html?id=${challengeId}`;
            });
        });
    };

    if (challengesContainer) {
        loadChallenges();
    }
});



