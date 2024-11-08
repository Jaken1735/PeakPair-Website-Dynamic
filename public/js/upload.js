export const handleRoutineUpload = (uploadForm) => {
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
            uploadForm.reset();
            loadRoutines();
        })
        .catch(error => {
            console.error('Error uploading routine:', error);
            alert('Failed to upload routine. Please try again.');
        });
    });
};
