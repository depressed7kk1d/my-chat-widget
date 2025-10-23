<script>
(function () {
  // ==============================
  // CSS (c фолбэками и страховкой)
  // ==============================
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
      z-index: 9000;
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
      /* страховка на случай где-то унаследованной прозрачности */
      backdrop-filter: none;
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
      background: var(--chat--color-background); /* явный фон шапки */
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
      transition: opacity 0.2s;
      font-size: 20px;
      opacity: 0.6;
    }

    .n8n-chat-widget .close-button:hover { opacity: 1; }

    .n8n-chat-widget .brand-header img { width: 32px; height: 32px; }
    .n8n-chat-widget .brand-header span {
      font-size: 18px; font-weight: 500; color: var(--chat--color-font);
    }

    .n8n-chat-widget .new-conversation {
      position: absolute; inset: 0;
      display: grid; place-items: center;
      padding: 20px; text-align: center;
    }

    .n8n-chat-widget .welcome-text {
      font-size: 24px; font-weight: 600; color: var(--chat--color-font);
      margin-bottom: 24px; line-height: 1.3;
    }

    .n8n-chat-widget .new-chat-btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 8px;
      padding: 16px 24px;
      background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
      color: #fff; border: none; border-radius: 8px; cursor: pointer;
      font-size: 16px; transition: transform 0.3s; font-weight: 500; font-family: inherit;
      margin-bottom: 12px;
    }

    .n8n-chat-widget .new-chat-btn:hover { transform: scale(1.02); }

    .n8n-chat-widget .message-icon { width: 20px; height: 20px; }

    .n8n-chat-widget .response-text {
      font-size: 14px; color: var(--chat--color-font); opacity: 0.7; margin: 0;
    }

    .n8n-chat-widget .chat-interface { display: none; flex-direction: column; height: 100%; }
    .n8n-chat-widget .chat-interface.active { display: flex; }

    .n8n-chat-widget .chat-messages {
      flex: 1; overflow-y: auto; padding: 20px;
      background: var(--chat--color-background);
      display: flex; flex-direction: column;
    }

    .n8n-chat-widget .chat-message {
      padding: 12px 16px; margin: 8px 0; border-radius: 12px; max-width: 80%;
      word-wrap: break-word; font-size: 14px; line-height: 1.5;
    }

    .n8n-chat-widget .chat-message.user {
      background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
      color: #fff; align-self: flex-end;
      box-shadow: 0 4px 12px rgba(133, 79, 255, 0.2);
      border: none;
    }

    .n8n-chat-widget .chat-message.bot {
      background: var(--chat--color-background);
      border: 1px solid rgba(133, 79, 255, 0.2);
      color: var(--chat--color-font);
      align-self: flex-start;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }

    .n8n-chat-widget .chat-input {
      padding: 16px; background: var(--chat--color-background);
      border-top: 1px solid rgba(133, 79, 255, 0.1);
      display: flex; gap: 8px;
    }

    .n8n-chat-widget .chat-input textarea {
      flex: 1; padding: 12px;
      border: 1px solid rgba(133, 79, 255, 0.2);
      border-radius: 8px; background: var(--chat--color-background);
      color: var(--chat--color-font); resize: none;
      font-family: inherit; font-size: 16px;
    }

    .n8n-chat-widget .chat-input textarea::placeholder { color: var(--chat--color-font); opacity: .6; }

    .n8n-chat-widget .chat-input button {
      background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
      color: #fff; border: none; border-radius: 8px; padding: 0 20px; cursor: pointer;
      transition: transform .2s; font-family: inherit; font-weight: 500;
    }

    .n8n-chat-widget .chat-input button:hover { transform: scale(1.05); }

    .n8n-chat-widget .chat-toggle {
      position: fixed; bottom: 20px; right: 20px;
      width: 180px; height: 60px; border-radius: 12px;
      background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
      color: #fff; border: none; cursor: pointer;
      box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
      z-index: 8999; transition: transform .3s;
      display: flex; align-items: center; justify-content: center;
      font-size: 20px; font-weight: 700; text-align: center; padding: 0 10px; line-height: 1.2;
      white-space: nowrap; overflow: hidden;
    }

    .n8n-chat-widget .chat-toggle span {
      display: block; width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }

    .n8n-chat-widget .chat-toggle::before {
      content: ''; position: absolute; top: 0; left: -50%; width: 50%; height: 100%;
      background-color: rgba(255,255,255,0.6); transform: skewX(-45deg); animation: move-light 2s infinite;
    }

    @keyframes move-light {
      0% { left: -50%; } 50% { left: 100%; } 100% { left: -50%; }
    }

    .n8n-chat-widget .chat-footer {
      padding: 8px; text-align: center; background: var(--chat--color-background);
      border-top: 1px solid rgba(133, 79, 255, 0.1);
    }

    .n8n-chat-widget .chat-footer a {
      color: var(--chat--color-primary); text-decoration: none; font-size: 12px; opacity: .8; transition: opacity .2s; font-family: inherit;
    }

    .n8n-chat-widget .chat-footer a:hover { opacity: 1; }

    /* 📱 Адаптация под телефоны */
    @media (max-width: 768px) {
      .n8n-chat-widget .chat-container {
        /* Используем JS-переменную --vh для корректного 100dvh на iOS */
        width: 100vw;
        height: calc(var(--vh, 1vh) * 100);
        max-width: 100vw;
        max-height: calc(var(--vh, 1vh) * 100);
        top: 0; bottom: 0; right: 0; left: 0; border-radius: 0;
        background: var(--chat--color-background); /* ЯВНО белый / заданный фон */
      }

      .n8n-chat-widget .chat-toggle {
        width: 140px; height: 50px; font-size: 16px; font-weight: 600;
      }
    }

    /* 📱 Очень маленькие экраны */
    @media (max-width: 480px) {
      .n8n-chat-widget .chat-container { font-size: 13px; }
      .n8n-chat-widget .chat-input textarea { font-size: 16px; padding: 10px; }
      .n8n-chat-widget .chat-input button { padding: 0 14px; font-size: 13px; }
    }
  `;

  // Подключаем шрифт Geist
  const fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = 'https://cdn.jsdelivr.net/npm/geist@1.0.0/dist/fonts/geist-sans/style.css';
  document.head.appendChild(fontLink);

  // Вставляем стили
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);

  // ==============================
  // Безопасный мердж конфига
  // ==============================
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
      primaryColor: '#854fff',
      secondaryColor: '#6b3fd4',
      position: 'right',
      backgroundColor: '#ffffff',
      fontColor: '#333333'
    }
  };

  // Хелперы
  const isNonEmpty = (v) => !(v == null || String(v).trim() === '');
  const mergeSafe = (base, patch) => {
    const out = { ...base };
    if (patch && typeof patch === 'object') {
      for (const k of Object.keys(patch)) {
        const v = patch[k];
        if (v && typeof v === 'object' && !Array.isArray(v)) {
          out[k] = mergeSafe(base[k] || {}, v);
        } else {
          // не затираем дефолты пустыми строками/undefined/null
          if (isNonEmpty(v)) out[k] = v;
        }
      }
    }
    return out;
  };

  const config = window.ChatWidgetConfig ? mergeSafe(defaultConfig, window.ChatWidgetConfig) : defaultConfig;

  if (window.N8NChatWidgetInitialized) return;
  window.N8NChatWidgetInitialized = true;

  let currentSessionId = '';

  // ==============================
  // DOM
  // ==============================
  const widgetContainer = document.createElement('div');
  widgetContainer.className = 'n8n-chat-widget';

  // Безопасная установка CSS-переменных: не пишем пустые значения
  const setCssVar = (el, name, val) => {
    if (isNonEmpty(val)) {
      el.style.setProperty(name, String(val));
    } else {
      // оставляем переменную неустановленной, чтобы сработал CSS fallback
    }
  };

  setCssVar(widgetContainer, '--n8n-chat-primary-color',   config.style.primaryColor);
  setCssVar(widgetContainer, '--n8n-chat-secondary-color', config.style.secondaryColor);
  setCssVar(widgetContainer, '--n8n-chat-background-color',config.style.backgroundColor);
  setCssVar(widgetContainer, '--n8n-chat-font-color',      config.style.fontColor);

  const chatContainer = document.createElement('div');
  chatContainer.className = `chat-container${config.style.position === 'left' ? ' position-left' : ''}`;

  const newConversationHTML = `
    <div class="brand-header">
      <img src="${isNonEmpty(config.branding.logo) ? config.branding.logo : ''}" alt="${config.branding.name}">
      <span>${config.branding.name}</span>
      <button class="close-button" aria-label="Закрыть">×</button>
    </div>
    <div class="new-conversation">
      <div>
        <h2 class="welcome-text">${config.branding.welcomeText}</h2>
        <button class="new-chat-btn" type="button">
          <svg class="message-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/>
          </svg>
          Написать виртуальному ассистенту
        </button>
        <p class="response-text">${config.branding.responseTimeText || ''}</p>
      </div>
    </div>
  `;

  const chatInterfaceHTML = `
    <div class="chat-interface" role="dialog" aria-label="${config.branding.name}">
      <div class="brand-header">
        <img src="${isNonEmpty(config.branding.logo) ? config.branding.logo : ''}" alt="${config.branding.name}">
        <span>${config.branding.name}</span>
        <button class="close-button" aria-label="Закрыть">×</button>
      </div>
      <div class="chat-messages"></div>
      <div class="chat-input">
        <textarea placeholder="Напишите ваше сообщение" rows="1"></textarea>
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
  toggleButton.type = 'button';
  toggleButton.innerHTML = `<span>Спросите ИИ</span>`;

  widgetContainer.appendChild(chatContainer);
  widgetContainer.appendChild(toggleButton);
  document.body.appendChild(widgetContainer);

  // Элементы
  const newChatBtn = chatContainer.querySelector('.new-chat-btn');
  const chatInterface = chatContainer.querySelector('.chat-interface');
  const messagesContainer = chatContainer.querySelector('.chat-messages');
  const textarea = chatContainer.querySelector('textarea');
  const sendButton = chatContainer.querySelector('button[type="submit"]');
  const closeButtons = chatContainer.querySelectorAll('.close-button');

  // ==============================
  // iOS/Safari 100dvh фикс
  // ==============================
  const setVhUnit = () => {
    const vh = window.innerHeight * 0.01;
    widgetContainer.style.setProperty('--vh', `${vh}px`);
  };
  setVhUnit();
  window.addEventListener('resize', setVhUnit);
  window.addEventListener('orientationchange', setVhUnit);
  // Иногда iOS корректирует высоту после фокуса поля ввода
  textarea.addEventListener('focus', () => setTimeout(setVhUnit, 50));
  textarea.addEventListener('blur', () => setTimeout(setVhUnit, 50));

  // ==============================
  // Логика
  // ==============================
  function generateUUID() {
    if (crypto && crypto.randomUUID) return crypto.randomUUID();
    // fallback
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  async function startNewConversation() {
    currentSessionId = generateUUID();
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

      chatContainer.querySelectorAll('.brand-header').forEach(h => (h.style.display = 'none'));
      const newConv = chatContainer.querySelector('.new-conversation');
      if (newConv) newConv.style.display = 'none';
      chatInterface.classList.add('active');

      const botMessageDiv = document.createElement('div');
      botMessageDiv.className = 'chat-message bot';
      botMessageDiv.innerHTML = (Array.isArray(responseData) && responseData[0] && responseData[0].output)
        ? responseData[0].output
        : (responseData.output || "Здравствуйте! Я — Оксана, онлайн-консультант школы Алгоритмика 😊 Рада помочь вам подобрать курс. Подскажите, пожалуйста, как вас зовут?");
      messagesContainer.appendChild(botMessageDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async function sendMessage(message) {
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

    try {
      const response = await fetch(config.webhook.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData)
      });

      const data = await response.json();

      const botMessageDiv = document.createElement('div');
      botMessageDiv.className = 'chat-message bot';
      botMessageDiv.innerHTML = Array.isArray(data) ? (data[0]?.output ?? '') : (data.output ?? '');
      messagesContainer.appendChild(botMessageDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    } catch (error) {
      console.error('Error:', error);
    }
  }

  // События
  newChatBtn.addEventListener('click', startNewConversation);

  const sendIfNotEmpty = () => {
    const message = textarea.value.trim();
    if (message) {
      sendMessage(message);
      textarea.value = '';
    }
  };

  sendButton.addEventListener('click', sendIfNotEmpty);

  textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendIfNotEmpty();
    }
  });

  toggleButton.addEventListener('click', () => {
    chatContainer.classList.toggle('open');
    // обновим vh при открытии
    setVhUnit();
  });

  closeButtons.forEach(button => {
    button.addEventListener('click', () => {
      chatContainer.classList.remove('open');
    });
  });
})();
</script>
