document.addEventListener('DOMContentLoaded', () => {
    const profileContainer = document.getElementById('profile-container');
    const upcomingContainer = document.getElementById('upcoming-container');
    let workoutRatings = {}; // Store ratings temporarily in an object

    // Simulated data for previous workouts
    const prev_workouts = [
        {title: "Full Body Workout", user: 'Ludvig', description: "A complete routine to work your entire body."},
        {title: "Leg Day Special", user: 'Sigrid', description: "An intense leg workout to build strength."},
        {title: "Cardio Blast", user: 'Karin', description: "A quick cardio routine to boost stamina."}
    ];

    // Simulated data for upcoming workouts
    const upcomingRoutines = [
        {title: "HIIT Circuit", user: 'Chris', description: "High-Intensity Interval Training for fat loss."},
        {title: "Morning Yoga", user: 'Anna', description: "A relaxing yoga session to start your day right."},
        {title: "Strength Training", user: 'Michael', description: "Build strength and muscle with this workout."}
    ];

    // Utility function to create a routine card with a rating feature for previous workouts
    const routineCard = (routine) => `
        <div class="col-md-4 col-sm-6 col-12 routine-card">
            <div class="card h-100 p-3 d-flex flex-column justify-content-between">
                <div class="routine-info">
                    <h5 class="card-title">${routine.title}</h5>
                    <p class="card-subtitle text-muted mb-2">Client: ${routine.user}</p>
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

    // Utility function to create an upcoming workout card without rating
    const upcomingRoutineCard = (routine) => `
        <div class="col-md-4 col-sm-6 col-12 routine-card">
            <div class="card h-100 p-3 d-flex flex-column justify-content-between">
                <div class="routine-info">
                    <h5 class="card-title">${routine.title}</h5>
                    <p class="card-subtitle text-muted mb-2">Client: ${routine.user}</p>
                    <p class="card-text">${routine.description}</p>
                    <p </p>
                </div>
                <div class="mt-auto">
                    <button class="btn btn-secondary btn-sm" onclick="goToDetails('${routine.title}', '${routine.user}', '${routine.description}')">
                        View Details
                    </button>
                </div>
            </div>
        </div>
    `;

    // Load routines into containers
    const loadRoutines = (container, routines, cardFunction) => {
        if (container) {
            container.innerHTML = routines.map(routine => cardFunction(routine)).join('');
        }
    };

    loadRoutines(profileContainer, prev_workouts, routineCard);
    loadRoutines(upcomingContainer, upcomingRoutines, upcomingRoutineCard);

    // Function to set selected stars based on the rating value
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

            // Update selected stars based on the clicked star
            const stars = starElement.parentElement.querySelectorAll('.star');
            setStars(stars, ratingValue);

            // Save the rating
            workoutRatings[title] = ratingValue;
            //document.getElementById(`feedback-${title}`).textContent = `You rated this ${ratingValue} stars.`;
        }
    });

    // Event listener for hover effect on stars
    document.addEventListener('mouseover', (event) => {
        if (event.target.classList.contains('star')) {
            const starElement = event.target;
            const ratingValue = parseInt(starElement.getAttribute('data-value'));
            const stars = starElement.parentElement.querySelectorAll('.star');

            stars.forEach((star, index) => {
                star.classList.toggle('hovered', index < ratingValue);
            });
        }
    });

    // Remove hover effect when mouse leaves stars
    document.addEventListener('mouseout', (event) => {
        if (event.target.classList.contains('star')) {
            const stars = event.target.parentElement.querySelectorAll('.star');
            stars.forEach(star => star.classList.remove('hovered'));
        }
    });

    // Define the `goToDetails` function
    window.goToDetails = (title, user, description) => {
        alert(`Workout Details:\nTitle: ${title}\nTrainer: ${user}\nDescription: ${description}`);
    };
});



