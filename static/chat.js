// Initialize chat state
let chatHistory = {
    "chats": []
};

// Create and position sunflowers
function createSunflowers() {
    for (let i = 0; i < 12; i++) {
        const sunflower = document.createElement('div');
        sunflower.className = 'sunflower';
        
        // Create center
        const center = document.createElement('div');
        center.className = 'center';
        sunflower.appendChild(center);
        
        // Create petals container
        const petals = document.createElement('div');
        petals.className = 'petals';
        
        // Create 12 petals
        for (let j = 0; j < 12; j++) {
            const petal = document.createElement('div');
            petal.className = 'petal';
            petal.style.transform = `rotate(${j * 30}deg)`;
            petals.appendChild(petal);
        }
        
        sunflower.appendChild(petals);
        
        // Position randomly
        sunflower.style.left = Math.random() * 100 + '%';
        sunflower.style.top = Math.random() * 100 + '%';
        sunflower.style.transform = `scale(${0.8 + Math.random() * 0.4})`;
        
        document.body.appendChild(sunflower);
    }
}

// Display a message in the UI
function displayMessage(message, isUser = true) {
    const messagesContainer = document.getElementById('messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
    messageDiv.textContent = message;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Send message to server and update chat history
async function sendMessage() {
    const input = document.getElementById('messageInput');
    const text = input.value.trim();
    
    if (text) {
        // Add user message to chat history
        chatHistory.chats.push({ 'user': text });
        displayMessage(text, true);
        
        try {
            // Send updated chat history to server
            const response = await fetch('http://localhost:8000/chats', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(chatHistory)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // Get updated chat history with AI response
            const data = await response.json();
            
            // Update local chat history
            chatHistory = data;
            
            // Display AI response (last message in the chat history)
            const lastMessage = chatHistory.chats[chatHistory.chats.length - 1];
            if (lastMessage.ai) {
                displayMessage(lastMessage.ai, false);
            }
            
        } catch (error) {
            console.error('Error:', error);
            displayMessage('Sorry, there was an error sending your message.', false);
        }
        
        // Clear input
        input.value = '';
    }
}

// Handle enter key
document.getElementById('messageInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Initialize sunflowers
createSunflowers();