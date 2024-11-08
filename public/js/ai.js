export const handleAIForm = (aiForm) => {
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
};