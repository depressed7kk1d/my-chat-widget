(function() {
// Create and inject styles
const styles = `/* ... стили остаются без изменений ... */`;

// Load Geist font
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href = '[https://cdn.jsdelivr.net/npm/geist@1.0.0/dist/fonts/geist-sans/style.css](https://cdn.jsdelivr.net/npm/geist@1.0.0/dist/fonts/geist-sans/style.css)';
document.head.appendChild(fontLink);

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

// Default configuration
const defaultConfig = {
webhook: { url: '', route: '' },
branding: {
logo: '',
name: '',
welcomeText: 'Здравствуйте, задайте свой вопрос!',
responseTimeText: '',
poweredBy: {
text: 'Создано совместно с Algoritmika Vladivostok ❤️',
link: '[https://vladivostok.algoritmika.org/ru](https://vladivostok.algoritmika.org/ru)'
}
},
style: {
primaryColor: '',
secondaryColor: '',
position: 'right',
backgroundColor: '#ffffff',
fontColor: '#333333'
}
};

const config = window.ChatWidgetConfig ? {
webhook: { ...defaultConfig.webhook, ...window.ChatWidgetConfig.webhook },
branding: { ...defaultConfig.branding, ...window.ChatWidgetConfig.branding },
style: { ...defaultConfig.style, ...window.ChatWidgetConfig.style }
} : defaultConfig;

// Prevent double init
if (window.N8NChatWidgetInitialized) return;
window.N8NChatWidgetInitialized = true;

let currentSessionId = '';

const widgetContainer = document.createElement('div');
widgetContainer.className = 'n8n-chat-widget';

// Apply CSS variables from config
if (config.style.primaryColor) widgetContainer.style.setProperty('--chat--color-primary', config.style.primaryColor);
if (config.style.secondaryColor) widgetContainer.style.setProperty('--chat--color-secondary', config.style.secondaryColor);
if (config.style.backgroundColor) widgetContainer.style.setProperty('--chat--color-background', config.style.backgroundColor);
if (config.style.fontColor) widgetContainer.style.setProperty('--chat--color-font', config.style.fontColor);

const chatContainer = document.createElement('div');
chatContainer.className = `chat-container${config.style.position === 'left' ? ' position-left' : ''}`;

// Универсальный brandHeader
const brandHeaderHTML = `     <div class="brand-header">       <img src="${config.branding.logo}" alt="${config.branding.name}">       <span>${config.branding.name}</span>       <button class="close-button" aria-label="Close">×</button>     </div>
  `;

const newConversationHTML = `     ${brandHeaderHTML}     <div class="new-conversation">       <h2 class="welcome-text">${config.branding.welcomeText}</h2>       <button class="new-chat-btn" type="button">         <svg class="message-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">           <path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/>         </svg>
        Написать виртуальному ассистенту       </button>       <p class="response-text">${config.branding.responseTimeText}</p>     </div>
  `;

const chatInterfaceHTML = `     <div class="chat-interface">
      ${brandHeaderHTML}       <div class="chat-messages" role="log" aria-live="polite"></div>       <div class="chat-input">         <textarea placeholder="Напишите ваше сообщение" rows="1" aria-label="Введите сообщение"></textarea>         <button type="submit">Отправить</button>       </div>       <div class="chat-footer">         <a href="${config.branding.poweredBy.link}" target="_blank" rel="noopener noreferrer">${config.branding.poweredBy.text}</a>       </div>     </div>
  `;

chatContainer.innerHTML = newConversationHTML + chatInterfaceHTML;

const toggleButton = document.createElement('button');
toggleButton.className = `chat-toggle${config.style.position === 'left' ? ' position-left' : ''}`;
toggleButton.innerHTML = `<span>Спросите ИИ</span>`;
toggleButton.type = 'button';
toggleButton.setAttribute('aria-expanded', 'false');

widgetContainer.appendChild(chatContainer);
widgetContainer.appendChild(toggleButton);
document.body.appendChild(widgetContainer);

// Elements
const newChatBtn = chatContainer.querySelector('.new-chat-btn');
const chatInterface = chatContainer.querySelector('.chat-interface');
const messagesContainer = chatContainer.querySelector('.chat-messages');
const textarea = chatContainer.querySelector('textarea');
const sendButton = chatContainer.querySelector('button[type="submit"]');

function generateUUID() {
if (crypto && crypto.randomUUID) return crypto.randomUUID();
return 'xxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
const r = Math.random() * 16 | 0;
const v = c === 'x' ? r : (r & 0x3 | 0x8);
return v.toString(16);
});
}

async function startNewConversation() {
currentSessionId = generateUUID();
chatContainer.querySelector('.new-conversation').style.display = 'none';
chatInterface.classList.add('active');

```
if (config.webhook && config.webhook.url) {
  const data = [{
    action: "loadPreviousSession",
    sessionId: currentSessionId,
    route: config.webhook.route,
    metadata: { userId: "" }
  }];

  try {
    const response = await fetch(config.webhook.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const responseData = await response.json();
    const botOutput = (Array.isArray(responseData) && responseData[0] && responseData[0].output)
      ? responseData[0].output
      : (responseData.output || "Привет, задайте мне вопрос!");
    appendBotMessage(botOutput);
  } catch (err) {
    console.error('Error loading previous session:', err);
    appendBotMessage("Привет, задайте мне вопрос!");
  }
} else {
  appendBotMessage("Привет, задайте мне вопрос!");
}
```

}

function appendBotMessage(html) {
const botMessageDiv = document.createElement('div');
botMessageDiv.className = 'chat-message bot';
botMessageDiv.innerHTML = html;
messagesContainer.appendChild(botMessageDiv);
messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

async function sendMessage(message) {
if (!currentSessionId) currentSessionId = generateUUID();

```
const messageData = {
  action: "sendMessage",
  sessionId: currentSessionId,
  route: config.webhook.route,
  chatInput: message,
  metadata: { userId: "" }
};

const userMessageDiv = document.createElement('div');
userMessageDiv.className = 'chat-message user';
userMessageDiv.textContent = message;
messagesContainer.appendChild(userMessageDiv);
messagesContainer.scrollTop = messagesContainer.scrollHeight;

if (config.webhook && config.webhook.url) {
  try {
    const response = await fetch(config.webhook.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(messageData)
    });
    const data = await response.json();
    const botHtml = Array.isArray(data) ? (data[0] && data[0].output) : data.output;
    appendBotMessage(botHtml || "Ответ отсутствует.");
  } catch (err) {
    console.error('Error sending message:', err);
    appendBotMessage("Ошибка связи с сервером. Попробуйте позже.");
  }
} else {
  appendBotMessage("(тестовый режим) Вы написали: " + message);
}
```

}

// Event listeners
newChatBtn.addEventListener('click', startNewConversation);

sendButton.addEventListener('click', () => {
const message = textarea.value.trim();
if (message) {
sendMessage(message);
textarea.value = '';
textarea.focus();
}
});

textarea.addEventListener('keypress', (e) => {
if (e.key === 'Enter' && !e.shiftKey) {
e.preventDefault();
const message = textarea.value.trim();
if (message) {
sendMessage(message);
textarea.value = '';
}
}
});

toggleButton.addEventListener('click', () => {
const isOpen = chatContainer.classList.toggle('open');
toggleButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});

const closeButtons = chatContainer.querySelectorAll('.close-button');
closeButtons.forEach(button => {
button.addEventListener('click', () => {
chatContainer.classList.remove('open');
});
});

document.addEventListener('keydown', (e) => {
if (e.key === 'Escape' && chatContainer.classList.contains('open')) {
chatContainer.classList.remove('open');
toggleButton.setAttribute('aria-expanded', 'false');
}
});

})();
