document.addEventListener('DOMContentLoaded', () => {
    const profileContainer = document.getElementById('profile-container');
    const upcomingContainer = document.getElementById('upcoming-container');
    let workoutRatings = {}; // Store ratings temporarily in an object

    // Simulated data for previous routines
    const routines = [
        { title: "Full Body Workout", trainer: 'Dwayne Johnson', description: "A complete routine to work your entire body." },
        { title: "Leg Day Special", trainer: 'Eli Busk', description: "An intense leg workout to build strength." },
        { title: "Cardio Blast", trainer: 'Karin Otterberg', description: "A quick cardio routine to boost stamina." }
    ];

    // Simulated data for upcoming routines
    const upcomingRoutines = [
        { title: "HIIT Circuit", trainer: 'Chris Hemsworth', description: "High-Intensity Interval Training for fat loss." },
        { title: "Morning Yoga", trainer: 'Anna Taylor', description: "A relaxing yoga session to start your day right." },
        { title: "Strength Training", trainer: 'Michael Lee', description: "Build strength and muscle with this workout." }
    ];

    // Utility function to create a routine card with rating
    const routineCard = (routine) => `
        <div class="col-md-4 col-sm-6 col-12 routine-card">
            <div class="card h-100 p-3 d-flex flex-column justify-content-between">
                <div class="routine-info">
                    <h5 class="card-title">${routine.title}</h5>
                    <p class="card-subtitle text-muted mb-2">Trainer: ${routine.trainer}</p>
                    <p class="card-text">${routine.description}</p>
                </div>
                <div class="rating-container mt-3">
                    <label>Rate this workout:</label>
                    <div class="rating-stars" data-title="${routine.title}">
                        ${[1, 2, 3, 4, 5].map(star => `
                            <span class="star" data-value="${star}">&#9733;</span>
                        `).join('')}
                    </div>
                    <div class="rating-feedback" id="feedback-${routine.title}"></div>
                </div>
           
            </div>
        </div>
    `;

    // Utility function to create an upcoming workout card (no rating needed)
    const upcomingRoutineCard = (routine) => `
        <div class="col-md-4 col-sm-6 col-12 routine-card">
            <div class="card h-100 p-3 d-flex flex-column justify-content-between">
                <div class="routine-info">
                    <h5 class="card-title">${routine.title}</h5>
                    <p class="card-subtitle text-muted mb-2">Trainer: ${routine.trainer}</p>
                    <p class="card-text">${routine.description}</p>
                    <p </p>
                </div>
                <div class="mt-auto">
                    <button class="btn btn-secondary btn-sm" onclick="goToDetails('${routine.title}', '${routine.trainer}', '${routine.description}')">
                        View Details
                    </button>
                </div>
            </div>
        </div>
    `;

    // Function to load and display routines
    const loadRoutines = (container, routines, cardFunction) => {
        if (container) {
            container.innerHTML = routines.map(routine => cardFunction(routine)).join('');
        }
    };

    // Load previous workouts with rating
    loadRoutines(profileContainer, routines, routineCard);

    // Load upcoming workouts without rating
    loadRoutines(upcomingContainer, upcomingRoutines, upcomingRoutineCard);

    // Real-time feedback based on the selected star rating
    const feedbackText = (rating) => {
        switch (rating) {
            default: return "";
        }
    };

    // Function to set stars up to a given rating value as selected
    const setStars = (stars, ratingValue) => {
        stars.forEach((star, index) => {
            star.classList.toggle('selected', index < ratingValue);
        });
    };

    // Event listener for star rating clicks
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('star')) {
            const starElement = event.target;
            const ratingValue = parseInt(starElement.getAttribute('data-value'));
            const title = starElement.parentElement.getAttribute('data-title');

            // Update the selected state for clicked stars
            const stars = starElement.parentElement.querySelectorAll('.star');
            setStars(stars, ratingValue);

            // Save the rating for this workout
            workoutRatings[title] = ratingValue;
            document.getElementById(`feedback-${title}`).textContent = feedbackText(ratingValue);
        }
    });

    // Event listeners for hover effect on stars
    document.addEventListener('mouseover', (event) => {
        if (event.target.classList.contains('star')) {
            const starElement = event.target;
            const ratingValue = parseInt(starElement.getAttribute('data-value'));
            const stars = starElement.parentElement.querySelectorAll('.star');

            // Apply hovered style up to the hovered star
            stars.forEach((star, index) => {
                star.classList.toggle('hovered', index < ratingValue);
            });
        }
    });

    // Remove hover effect when the mouse leaves a star
    document.addEventListener('mouseout', (event) => {
        if (event.target.classList.contains('star')) {
            const stars = event.target.parentElement.querySelectorAll('.star');
            stars.forEach((star) => star.classList.remove('hovered'));
        }
    });

    // Event listener for "Leave a rating" button clicks
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('leave-rating-btn')) {
            const title = event.target.getAttribute('data-title');
            const rating = workoutRatings[title];

            if (rating) {
                alert(`Thank you! You've submitted a rating of ${rating} stars for "${title}".`);
            } else {
                alert(`Please select a rating for "${title}" before submitting.`);
            }
        }
    });
});

// Function to redirect to workout details page
function goToDetails(title, trainer, description) {
    const url = `workout-details.html?title=${encodeURIComponent(title)}&trainer=${encodeURIComponent(trainer)}&description=${encodeURIComponent(description)}`;
    window.location.href = url;
}
