document.addEventListener('DOMContentLoaded', () => {
    const challengeDetailsContainer = document.getElementById('challenge-details');
    const challenges = [
        {
            id: 1,
            title: "Maximize your Cross-Fit training",
            description: "Challenge yourself by trying out a personal trainer specialized in Cross-Fit training.",
            details: "To complete this challenge, schedule and attend a session with a Cross-Fit personal trainer this month.",
            progress: 50
        },
        {
            id: 2,
            title: "Recommend your favorite <3",
            description: "Show your support by recommending your favorite personal trainer from last month.",
            details: "Write a recommendation for your favorite trainer on their profile page.",
            progress: 100
        },
        {
            id: 3,
            title: "Help newcomers!",
            description: "Give new personal trainers a boost by trying them out :)",
            details: "Book a session with a trainer who joined within the last 3 months.",
            progress: 33
        },
        {
            id: 4,
            title: "Expand your mindfulness",
            description: "Try a personal trainer specialized in Yoga!",
            details: "Schedule 5 sessions with different trainers that are specialized in Yoga.",
            progress: 20
        },
    ];

    const getQueryParams = () => {
        const params = {};
        const queryString = window.location.search.substring(1);
        const vars = queryString.split('&');
        vars.forEach((param) => {
            const pair = param.split('=');
            params[pair[0]] = decodeURIComponent(pair[1]);
        });
        return params;
    };

    const fetchTrainers = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/all-trainers');
            const trainers = await response.json();
            return trainers;
        } catch (error) {
            console.error('Error fetching trainers:', error);
            return [];
        }
    };

    const loadChallengeDetails = async () => {
        const params = getQueryParams();
        const challengeId = parseInt(params['id']);
        const challenge = challenges.find(ch => ch.id === challengeId);

        if (challenge) {
            const storedProgress = localStorage.getItem(`challenge_${challenge.id}_progress`);
            if (storedProgress !== null) {
                challenge.progress = parseInt(storedProgress);
            }

            const challengeHTML = `
                <div class="col-12">
                    <h2 class="challenge-title">${challenge.title}</h2>
                    <p class="challenge-description">${challenge.description}</p>
                    <p>${challenge.details}</p>

                    <div class="progress mb-4" style="height: 20px;">
                        <div class="progress-bar ${challenge.progress === 100 ? 'bg-success' : ''}" role="progressbar"
                            style="width: ${challenge.progress}%;" aria-valuenow="${challenge.progress}" aria-valuemin="0" aria-valuemax="100">
                            ${challenge.progress === 100 ? "Complete" : `${challenge.progress}%`}
                        </div>
                    </div>

                    <h3 class="mt-5">Recommended Trainers</h3>
                    <div class="row" id="recommended-trainers"></div>
                </div>
            `;
            challengeDetailsContainer.innerHTML = challengeHTML;

            const allTrainers = await fetchTrainers();
            let recommendedTrainers = [];

            if (challenge.id === 1) {
                recommendedTrainers = allTrainers.filter(trainer => trainer.training_areas.includes('CrossFit'));
            } else if (challenge.id === 3) {
                recommendedTrainers = allTrainers.filter(trainer => trainer.trainer_id >= 30);
            } else if (challenge.id === 4) {
                recommendedTrainers = allTrainers.filter(trainer => trainer.training_areas.includes('Yoga'));
            } else {
                recommendedTrainers = allTrainers;
            }

            const recommendedTrainersContainer = document.getElementById('recommended-trainers');

            if (recommendedTrainers.length > 0) {
                recommendedTrainers.forEach(trainer => {
                    const trainerHTML = `
                        <div class="col-md-6 col-lg-4">
                            <div class="trainer-card mb-4">
                                <h5>${trainer.name}</h5>
                                <p>Specialties: ${trainer.training_areas.join(', ')}</p>
                                <a href="trainer_profile.html?id=${trainer.trainer_id}" class="btn btn-view-profile">View Profile</a>
                            </div>
                        </div>
                    `;
                    recommendedTrainersContainer.innerHTML += trainerHTML;
                });
            } else {
                recommendedTrainersContainer.innerHTML = '<p>No trainers available for this challenge.</p>';
            }

        } else {
            challengeDetailsContainer.innerHTML = '<p>Challenge not found.</p>';
        }
    };

    if (challengeDetailsContainer) {
        loadChallengeDetails();
    }
});

