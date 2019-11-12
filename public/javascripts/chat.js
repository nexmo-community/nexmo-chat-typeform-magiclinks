class ChatApp {
  constructor() {
    this.messageTextarea = document.getElementById('messageTextarea');
    this.sendButton = document.getElementById('send');
    this.messages = document.getElementById('messages');
    this.messageFeed = document.getElementById('messageFeed');

    this.authenticateUser();
  }

  authenticateUser() {
    var req = new XMLHttpRequest();
    req.responseType = 'json';
    req.open('GET', '/jwt', true);

    req.onload  = function() {
       var response = req.response;

       this.joinConversation(response.client_token, response.conversation_id);
    };

    req.send(null);
  }

  joinConversation(userToken, conversationId) {
    new NexmoClient({ debug: false })
      .login(userToken)
      .then(app => {
        console.log('*** Logged into app', app);
        return app.getConversation(conversationId);
      })
      .then((conversation) => {
        console.log('*** Joined conversation', conversation);
        this.setupConversationEvents(conversation);
        this.setupUserEvents();
      })
      .catch(this.errorLogger);
  }

  setupConversationEvents(conversation) {
    this.conversation = conversation

    // Bind to events on the conversation
    conversation.on('text', (sender, message) => {
      const date = new Date(Date.parse(message.timestamp))
      console.log('*** Message received', sender, message)
      const text = `${sender.user.name} @ ${date.toLocaleString('en-GB')}: <b>${message.body.text}</b><br>`
      this.messageFeed.innerHTML = text + this.messageFeed.innerHTML
    })

    conversation.on("member:joined", (member, event) => {
      const date = new Date(Date.parse(event.timestamp))
      console.log(`*** ${member.user.name} joined the conversation`)
      const text = `${member.user.name} @ ${date.toLocaleString('en-GB')}: <b>joined the conversation</b><br>`
      this.messageFeed.innerHTML = text + this.messageFeed.innerHTML
    })

    this.showConversationHistory(conversation)
  }

  setupUserEvents() {
    this.sendButton.addEventListener('click', () => {
      this.conversation.sendText(this.messageTextarea.value)
        .then(() => {
            this.eventLogger('text')();
            this.messageTextarea.value = '';
        })
        .catch(this.errorLogger);
    })
  }

  errorLogger(error) {
    console.log(error)
  }

  eventLogger(event) {
    return () => {
      console.log("'%s' event was sent", event)
    }
  }
}

new ChatApp();