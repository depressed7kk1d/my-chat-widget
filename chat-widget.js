(function() {
  // Create and inject styles
  const styles = `
    .n8n-chat-widget {
      --chat--color-primary: var(--n8n-chat-primary-color, #854fff);
      --chat--color-secondary: var(--n8n-chat-secondary-color, #6b3fd4);
      --chat--color-background: var(--n8n-chat-background-color, #ffffff);
      --chat--color-font: var(--n8n-chat-font-color, #333333);
      font-family: 'Geist Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }

    .n8n-chat-widget .chat-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
      display: none;
      width: 380px;
      height: 600px;
      max-width: 90vw;
      max-height: 85vh;
      background: var(--chat--color-background);
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(133, 79, 255, 0.15);
      border: 1px solid rgba(133, 79, 255, 0.2);
      overflow: hidden;
      font-family: inherit;
    }

    .n8n-chat-widget .chat-container.position-left {
      right: auto;
      left: 20px;
    }

    .n8n-chat-widget .chat-container.open {
      display: flex;
      flex-direction: column;
    }

    .n8n-chat-widget .brand-header {
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      border-bottom: 1px solid rgba(133, 79, 255, 0.1);
      position: relative;
      background: var(--chat--color-background);
      z-index: 2;
    }

    .n8n-chat-widget .close-button {
      position: absolute;
      right: 16px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: var(--chat--color-font);
      cursor: pointer;
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.2s;
      font-size: 20px;
      opacity: 0.6;
      z-index: 3;
    }

    .n8n-chat-widget .close-button:hover { opacity: 1; }

    .n8n-chat-widget .brand-header img { width: 32px; height: 32px; }
    .n8n-chat-widget .brand-header span { font-size: 18px; font-weight: 500; color: var(--chat--color-font); }

    .n8n-chat-widget .new-conversation {
      padding: 20px;
      text-align: center;
      width: 100%;
      max-width: 300px;
      margin: 0 auto;
    }

    .n8n-chat-widget .welcome-text {
      font-size: 24px;
      font-weight: 600;
      color: var(--chat--color-font);
      margin-bottom: 24px;
      line-height: 1.3;
    }

    .n8n-chat-widget .new-chat-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      padding: 16px 24px;
      background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 16px;
      transition: transform 0.3s;
      font-weight: 500;
      font-family: inherit;
      margin-bottom: 12px;
    }

    .n8n-chat-widget .new-chat-btn:hover { transform: scale(1.02); }
    .n8n-chat-widget .message-icon { width: 20px; height: 20px; }

    .n8n-chat-widget .response-text {
      font-size: 14px;
      color: var(--chat--color-font);
      opacity: 0.7;
      margin: 0;
    }

    .n8n-chat-widget .chat-interface { display: none; flex-direction: column; height: 100%; }
    .n8n-chat-widget .chat-interface.active { display: flex; }

    .n8n-chat-widget .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      background: var(--chat--color-background);
      display: flex;
      flex-direction: column;
    }

    .n8n-chat-widget .chat-message {
      padding: 12px 16px;
      margin: 8px 0;
      border-radius: 12px;
      max-width: 80%;
      word-wrap: break-word;
      font-size: 14px;
      line-height: 1.5;
    }

    .n8n-chat-widget .chat-message.user {
      background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
      color: white;
      align-self: flex-end;
      box-shadow: 0 4px 12px rgba(133, 79, 255, 0.2);
      border: none;
    }

    .n8n-chat-widget .chat-message.bot {
      background: var(--chat--color-background);
      border: 1px solid rgba(133, 79, 255, 0.2);
      color: var(--chat--color-font);
      align-self: flex-start;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    .n8n-chat-widget .chat-input {
      padding: 16px;
      background: var(--chat--color-background);
      border-top: 1px solid rgba(133, 79, 255, 0.1);
      display: flex;
      gap: 8px;
    }

    .n8n-chat-widget .chat-input textarea {
      flex: 1;
      padding: 12px;
      border: 1px solid rgba(133, 79, 255, 0.2);
      border-radius: 8px;
      background: var(--chat--color-background);
      color: var(--chat--color-font);
      resize: none;
      font-family: inherit;
      font-size: 14px;
    }

    .n8n-chat-widget .chat-input textarea::placeholder {
      color: var(--chat--color-font);
      opacity: 0.6;
    }

    .n8n-chat-widget .chat-input button {
      background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
      color: white;
      border: none;
      border-radius: 8px;
      padding: 0 20px;
      cursor: pointer;
      transition: transform 0.2s;
      font-family: inherit;
      font-weight: 500;
    }

    .n8n-chat-widget .chat-input button:hover { transform: scale(1.05); }

    .n8n-chat-widget .chat-toggle {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 180px;
      height: 60px;
      border-radius: 12px;
      background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
      color: white;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
      z-index: 999;
      transition: transform 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      font-weight: 700;
      text-align: center;
      padding: 0 10px;
      line-height: 1.2;
      white-space: nowrap;
      overflow: hidden;
    }

    .n8n-chat-widget .chat-toggle span {
      display: block;
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .n8n-chat-widget .chat-toggle::before {
      content: '';
      position: absolute;
      top: 0;
      left: -50%;
      width: 50%;
      height: 100%;
      background-color: rgba(255, 255, 255, 0.6);
      transform: skewX(-45deg);
      animation: move-light 2s infinite;
    }

    @keyframes move-light {
      0% { left: -50%; }
      50% { left: 100%; }
      100% { left: -50%; }
    }

    .n8n-chat-widget .chat-footer {
      padding: 8px;
      text-align: center;
      background: var(--chat--color-background);
      border-top: 1px solid rgba(133, 79, 255, 0.1);
    }

    .n8n-chat-widget .chat-footer a {
      color: var(--chat--color-primary);
      text-decoration: none;
      font-size: 12px;
      opacity: 0.8;
      transition: opacity 0.2s;
      font-family: inherit;
    }

    .n8n-chat-widget .chat-footer a:hover { opacity: 1; }

    /* Mobile adaptations */
    @media (max-width: 768px) {
      .n8n-chat-widget .chat-container {
        width: 100vw;
        height: 100vh;
        max-width: 100vw;
        max-height: 100vh;
        bottom: 0;
        right: 0;
        left: 0;
        border-radius: 0;
      }

      .n8n-chat-widget .chat-container.open {
        position: fixed;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        display: flex;
        flex-direction: column;
        z-index: 10000;
      }

      .n8n-chat-widget .new-conversation {
        position: relative;
        margin-top: 16px;
      }

      .n8n-chat-widget .chat-toggle {
        width: 140px;
        height: 50px;
        font-size: 16px;
        font-weight: 600;
      }
    }

    @media (max-width: 480px) {
      .n8n-chat-widget .chat-container { font-size: 13px; }
      .n8n-chat-widget .chat-input textarea { font-size: 13px; padding: 10px; }
      .n8n-chat-widget .chat-input button { padding: 0 14px; font-size: 13px; }
    }
  `;

  // Load Geist font
  const fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = 'https://cdn.jsdelivr.net/npm/geist@1.0.0/dist/fonts/geist-sans/style.css';
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
        link: 'https://vladivostok.algoritmika.org/ru'
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

  // Apply CSS variables from config (if provided)
  if (config.style.primaryColor) widgetContainer.style.setProperty('--chat--color-primary', config.style.primaryColor);
  if (config.style.secondaryColor) widgetContainer.style.setProperty('--chat--color-secondary', config.style.secondaryColor);
  if (config.style.backgroundColor) widgetContainer.style.setProperty('--chat--color-background', config.style.backgroundColor);
  if (config.style.fontColor) widgetContainer.style.setProperty('--chat--color-font', config.style.fontColor);

  const chatContainer = document.createElement('div');
  chatContainer.className = `chat-container${config.style.position === 'left' ? ' position-left' : ''}`;

  const newConversationHTML = `
    <div class="brand-header">
      <img src="${config.branding.logo}" alt="${config.branding.name}">
      <span>${config.branding.name}</span>
      <button class="close-button" aria-label="Close">×</button>
    </div>
    <div class="new-conversation">
      <h2 class="welcome-text">${config.branding.welcomeText}</h2>
      <button class="new-chat-btn" type="button">
        <svg class="message-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/>
        </svg>
        Написать виртуальному ассистенту
      </button>
      <p class="response-text">${config.branding.responseTimeText}</p>
    </div>
  `;

  const chatInterfaceHTML = `
    <div class="chat-interface">
      <div class="brand-header">
        <img src="${config.branding.logo}" alt="${config.branding.name}">
        <span>${config.branding.name}</span>
        <button class="close-button" aria-label="Close">×</button>
      </div>
      <div class="chat-messages" role="log" aria-live="polite"></div>
      <div class="chat-input">
        <textarea placeholder="Напишите ваше сообщение" rows="1" aria-label="Введите сообщение"></textarea>
        <button type="submit">Отправить</button>
      </div>
      <div class="chat-footer">
        <a href="${config.branding.poweredBy.link}" target="_blank" rel="noopener noreferrer">${config.branding.poweredBy.text}</a>
      </div>
    </div>
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
    // fallback
    return 'xxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  async function startNewConversation() {
    currentSessionId = generateUUID();

    // UI switch
    chatContainer.querySelector('.new-conversation').style.display = 'none';
    chatInterface.classList.add('active');

    // Optionally notify backend to load previous session
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

    const messageData = {
      action: "sendMessage",
      sessionId: currentSessionId,
      route: config.webhook.route,
      chatInput: message,
      metadata: { userId: "" }
    };

    // append user message
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
      // No webhook — echo
      appendBotMessage("(тестовый режим) Вы написали: " + message);
    }
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

  // Close buttons (in both headers)
  const closeButtons = chatContainer.querySelectorAll('.close-button');
  closeButtons.forEach(button => {
    button.addEventListener('click', () => {
      chatContainer.classList.remove('open');
    });
  });

  // Accessibility: allow Esc to close when open
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && chatContainer.classList.contains('open')) {
      chatContainer.classList.remove('open');
      toggleButton.setAttribute('aria-expanded', 'false');
    }
  });

})();
