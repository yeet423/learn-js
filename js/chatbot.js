// Chatbot functionality for Mumbai Drainage Monitoring System

// Chatbot state
let chatbotState = {
    isOpen: false,
    isTyping: false,
    conversationHistory: [],
    currentContext: null
};

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeChatbot();
    addWelcomeMessage();
});

function initializeChatbot() {
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotBox = document.getElementById('chatbotBox');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');

    if (chatbotToggle) {
        chatbotToggle.addEventListener('click', toggleChatbot);
    }

    if (chatbotClose) {
        chatbotClose.addEventListener('click', closeChatbot);
    }

    if (chatSend) {
        chatSend.addEventListener('click', handleUserInput);
    }

    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleUserInput();
            }
        });

        // Auto-resize textarea
        chatInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 100) + 'px';
        });
    }
}

function toggleChatbot() {
    const chatbotBox = document.getElementById('chatbotBox');
    if (chatbotBox) {
        if (chatbotState.isOpen) {
            closeChatbot();
        } else {
            openChatbot();
        }
    }
}

function openChatbot() {
    const chatbotBox = document.getElementById('chatbotBox');
    const chatbotToggle = document.getElementById('chatbotToggle');
    
    if (chatbotBox) {
        chatbotBox.classList.remove('hidden');
        chatbotState.isOpen = true;
        
        // Focus on input
        const chatInput = document.getElementById('chatInput');
        if (chatInput) {
            setTimeout(() => chatInput.focus(), 100);
        }
        
        // Update toggle button
        if (chatbotToggle) {
            chatbotToggle.innerHTML = '<i class="fas fa-times text-xl"></i>';
        }
    }
}

function closeChatbot() {
    const chatbotBox = document.getElementById('chatbotBox');
    const chatbotToggle = document.getElementById('chatbotToggle');
    
    if (chatbotBox) {
        chatbotBox.classList.add('hidden');
        chatbotState.isOpen = false;
        
        // Reset toggle button
        if (chatbotToggle) {
            chatbotToggle.innerHTML = '<i class="fas fa-comments text-xl"></i>';
        }
    }
}

function addWelcomeMessage() {
    setTimeout(() => {
        const welcomeMessage = "👋 Hello! I'm your Mumbai Drainage Assistant. I can help you with:\n\n• Current water levels and sensor data\n• Emergency alerts and safety information\n• How to report drainage issues\n• System status and forecasts\n\nWhat would you like to know?";
        addChatMessage('bot', welcomeMessage);
    }, 1000);
}

function handleUserInput() {
    const chatInput = document.getElementById('chatInput');
    if (!chatInput) return;

    const userMessage = chatInput.value.trim();
    if (!userMessage) return;

    // Add user message to chat
    addChatMessage('user', userMessage);
    
    // Clear input
    chatInput.value = '';
    chatInput.style.height = 'auto';
    
    // Add to conversation history
    chatbotState.conversationHistory.push({
        role: 'user',
        message: userMessage,
        timestamp: new Date()
    });

    // Show typing indicator
    showTypingIndicator();

    // Generate and show response
    setTimeout(() => {
        const response = generateResponse(userMessage.toLowerCase());
        hideTypingIndicator();
        addChatMessage('bot', response);
        
        // Add to conversation history
        chatbotState.conversationHistory.push({
            role: 'bot',
            message: response,
            timestamp: new Date()
        });
    }, 1000 + Math.random() * 1000); // Simulate thinking time
}

function addChatMessage(sender, message) {
    const chatbotMessages = document.getElementById('chatbotMessages');
    if (!chatbotMessages) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-bubble ${sender === 'bot' ? 'bot-msg' : 'user-msg'}`;
    
    // Format message with line breaks and emojis
    const formattedMessage = formatMessage(message);
    messageDiv.innerHTML = formattedMessage;
    
    chatbotMessages.appendChild(messageDiv);
    
    // Clear float
    const clearDiv = document.createElement('div');
    clearDiv.style.clear = 'both';
    chatbotMessages.appendChild(clearDiv);
    
    // Scroll to bottom
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    
    // Add animation class
    messageDiv.classList.add('fade-in');
}

function formatMessage(message) {
    // Convert line breaks to HTML
    let formatted = message.replace(/\n/g, '<br>');
    
    // Make URLs clickable
    formatted = formatted.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" class="text-blue-600 underline">$1</a>');
    
    // Bold text between **
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    return formatted;
}

function showTypingIndicator() {
    const chatbotMessages = document.getElementById('chatbotMessages');
    if (!chatbotMessages) return;

    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-bubble bot-msg typing-indicator';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = `
        <div class="flex space-x-1">
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s;"></div>
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s;"></div>
        </div>
    `;
    
    chatbotMessages.appendChild(typingDiv);
    
    // Clear float
    const clearDiv = document.createElement('div');
    clearDiv.style.clear = 'both';
    clearDiv.id = 'typing-clear';
    chatbotMessages.appendChild(clearDiv);
    
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    chatbotState.isTyping = true;
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    const typingClear = document.getElementById('typing-clear');
    
    if (typingIndicator) typingIndicator.remove();
    if (typingClear) typingClear.remove();
    
    chatbotState.isTyping = false;
}

function generateResponse(input) {
    // Context-aware responses
    const responses = getContextualResponses(input);
    
    // Water level queries
    if (input.includes('water level') || input.includes('water height')) {
        chatbotState.currentContext = 'water_level';
        const currentLevel = typeof sensorData !== 'undefined' ? sensorData.waterLevel : 82;
        return `💧 **Current Water Level**: ${currentLevel} cm\n\nThis is ${getWaterLevelStatus(currentLevel)}. ${getWaterLevelAdvice(currentLevel)}\n\nWould you like to see the trend analysis or get alerts for this area?`;
    }
    
    // Rainfall queries
    if (input.includes('rain') || input.includes('precipitation')) {
        chatbotState.currentContext = 'rainfall';
        const currentRainfall = typeof sensorData !== 'undefined' ? sensorData.rainfall : 35;
        return `🌧️ **Current Rainfall**: ${currentRainfall} mm/hr\n\n${getRainfallStatus(currentRainfall)}\n\nI can provide a 3-hour forecast or help you prepare for heavy rainfall. What would you like to know?`;
    }
    
    // Flow speed queries
    if (input.includes('flow') || input.includes('speed') || input.includes('current')) {
        chatbotState.currentContext = 'flow';
        const currentFlow = typeof sensorData !== 'undefined' ? sensorData.flowSpeed : 0.6;
        return `🌊 **Current Flow Speed**: ${currentFlow} m/s\n\n${getFlowStatus(currentFlow)}\n\nThis indicates ${getFlowCondition(currentFlow)} drainage conditions.`;
    }
    
    // Alert and emergency queries
    if (input.includes('alert') || input.includes('emergency') || input.includes('danger')) {
        chatbotState.currentContext = 'alerts';
        const currentLevel = typeof sensorData !== 'undefined' ? sensorData.waterLevel : 82;
        if (currentLevel > 80) {
            return `🚨 **EMERGENCY ALERT ACTIVE**\n\nCritical water levels detected:\n• Sensor #3: ${currentLevel}cm (CRITICAL)\n• Immediate evacuation recommended for low-lying areas\n• Avoid travel unless absolutely necessary\n\n**Emergency Contacts:**\n• Fire Brigade: 101\n• Police: 100\n• Mumbai Emergency: 1800-MUMBAI-911\n\nStay safe! 🙏`;
        } else {
            return `✅ **All Clear**\n\nNo emergency alerts at the moment. All sensors are within normal parameters.\n\nI'll notify you immediately if any critical situations develop. You can also:\n• Set up custom alerts\n• View historical data\n• Report local issues`;
        }
    }
    
    // Location and sensor queries
    if (input.includes('location') || input.includes('sensor') || input.includes('map') || input.includes('where')) {
        chatbotState.currentContext = 'locations';
        return `📍 **Sensor Network Locations**\n\n🟢 **Sensor #1 - Dadar**: Normal (32cm)\n🟡 **Sensor #2 - Bandra**: Warning (68cm)  \n🔴 **Sensor #3 - Andheri**: Critical (85cm)\n\nOur sensors monitor key flood-prone areas across Mumbai. Click on any sensor on the map above for detailed information.\n\nNeed directions to a specific sensor or want to report an issue in your area?`;
    }
    
    // Forecast queries
    if (input.includes('forecast') || input.includes('predict') || input.includes('future') || input.includes('tomorrow')) {
        chatbotState.currentContext = 'forecast';
        return `🔮 **Weather & Water Level Forecast**\n\nNext 3 hours:\n• Water levels expected to ${getRandomTrend()}\n• Rainfall: ${getRandomRainfall()} mm/hr predicted\n• Risk level: ${getRandomRisk()}\n\n**Recommendations:**\n${getForecastAdvice()}\n\nClick the "Show Forecast" button above to see detailed predictions on the chart.`;
    }
    
    // Reporting queries
    if (input.includes('report') || input.includes('issue') || input.includes('problem') || input.includes('block')) {
        chatbotState.currentContext = 'reporting';
        return `📝 **Report a Drainage Issue**\n\nI can help you report:\n• Blocked drains or manholes\n• Flooding in your area\n• Broken sensors or equipment\n• Other drainage problems\n\n**Quick Report Options:**\n1. Use the report form below\n2. Send photos via WhatsApp: [Emergency WhatsApp](https://wa.me/919665478430)\n3. Call our hotline: 1800-MUMBAI-911\n\nWhat type of issue would you like to report?`;
    }
    
    // Help and general queries
    if (input.includes('help') || input.includes('how') || input.includes('what can you')) {
        return `🤖 **Mumbai Drainage Assistant Help**\n\nI can help you with:\n\n**📊 Real-time Data**\n• Current water levels\n• Rainfall intensity\n• Flow speeds and trends\n\n**🚨 Safety & Alerts**\n• Emergency notifications\n• Risk assessments\n• Safety recommendations\n\n**📍 Location Services**\n• Sensor locations\n• Area-specific information\n• Navigation assistance\n\n**📝 Reporting**\n• Submit drainage issues\n• Upload photos\n• Track report status\n\nJust ask me anything about Mumbai's drainage system! 😊`;
    }
    
    // Greeting responses
    if (input.includes('hello') || input.includes('hi') || input.includes('hey') || input.includes('good morning') || input.includes('good afternoon') || input.includes('good evening')) {
        const greetings = [
            "Hello! 👋 How can I help you with Mumbai's drainage monitoring today?",
            "Hi there! 😊 I'm here to assist you with real-time drainage information.",
            "Hey! 🌊 What would you like to know about our flood monitoring system?",
            "Good day! ☀️ Ready to help you stay safe and informed about water levels."
        ];
        return greetings[Math.floor(Math.random() * greetings.length)];
    }
    
    // Thank you responses
    if (input.includes('thank') || input.includes('thanks')) {
        const thankResponses = [
            "You're welcome! 😊 Stay safe and don't hesitate to ask if you need more help.",
            "Happy to help! 🙏 Remember, I'm here 24/7 for any drainage-related questions.",
            "Glad I could assist! 💙 Keep monitoring the alerts and stay prepared."
        ];
        return thankResponses[Math.floor(Math.random() * thankResponses.length)];
    }
    
    // Default fallback with suggestions
    const fallbackResponses = [
        "I'd be happy to help! 🤔 Could you be more specific? Try asking about:\n• Current water levels\n• Emergency alerts\n• Sensor locations\n• How to report issues",
        "I'm not sure I understand that completely. 😅 I specialize in:\n• Real-time drainage data\n• Flood alerts and safety\n• Reporting system issues\n• Mumbai weather conditions\n\nWhat specific information do you need?",
        "Let me help you better! 🎯 I can provide information about:\n• Live sensor readings\n• Emergency procedures\n• Area-specific flood risks\n• Reporting and maintenance\n\nWhat interests you most?"
    ];
    
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
}

// Helper functions for dynamic responses
function getWaterLevelStatus(level) {
    if (level < 40) return "**NORMAL** - well within safe limits";
    if (level < 70) return "**MODERATE** - worth monitoring";
    if (level < 85) return "**HIGH** - requires caution";
    return "**CRITICAL** - immediate attention needed";
}

function getWaterLevelAdvice(level) {
    if (level < 40) return "Continue normal activities, but stay informed.";
    if (level < 70) return "Avoid low-lying areas and keep emergency contacts handy.";
    if (level < 85) return "Consider alternate routes and prepare for possible evacuation.";
    return "Evacuate low-lying areas immediately and seek higher ground.";
}

function getRainfallStatus(rainfall) {
    if (rainfall < 10) return "Light rainfall - minimal flood risk.";
    if (rainfall < 25) return "Moderate rainfall - monitor drainage systems.";
    if (rainfall < 50) return "Heavy rainfall - increased flood risk.";
    return "Extreme rainfall - high flood probability.";
}

function getFlowStatus(flow) {
    if (flow < 0.3) return "Slow drainage flow detected.";
    if (flow < 0.8) return "Normal drainage flow.";
    return "Fast drainage flow - system handling capacity well.";
}

function getFlowCondition(flow) {
    if (flow < 0.3) return "potentially congested";
    if (flow < 0.8) return "normal";
    return "excellent";
}

function getRandomTrend() {
    const trends = ["rise gradually", "remain stable", "decrease slightly", "fluctuate"];
    return trends[Math.floor(Math.random() * trends.length)];
}

function getRandomRainfall() {
    return Math.floor(Math.random() * 30) + 10;
}

function getRandomRisk() {
    const risks = ["Low", "Moderate", "High"];
    return risks[Math.floor(Math.random() * risks.length)];
}

function getForecastAdvice() {
    const advice = [
        "• Carry an umbrella and wear waterproof clothing\n• Avoid unnecessary travel during peak hours",
        "• Check drainage systems around your property\n• Keep emergency supplies ready",
        "• Monitor alerts closely and plan alternate routes\n• Stay indoors during heavy rainfall periods"
    ];
    return advice[Math.floor(Math.random() * advice.length)];
}

function getContextualResponses(input) {
    // This could be expanded with more sophisticated NLP
    // For now, using simple keyword matching with context awareness
    return null;
}

// Export chatbot functions for external use
window.chatbotFunctions = {
    addChatMessage,
    generateResponse,
    openChatbot,
    closeChatbot,
    chatbotState
};