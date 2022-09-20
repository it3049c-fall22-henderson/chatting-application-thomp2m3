//Referenced elements
const nameInput = document.getElementById("my-name-input");
const myMessage = document.getElementById("my-message");
const sendButton = document.getElementById("send-button");
const chatBox = document.getElementById("chat");
const serverURL = `https://it3049-c-chat-application.herokuapp.com/messages`;

//Initial call
updateMessages()

//Calling updateMessages every 10 seconds to populate new messages
const MILLISECONDS_IN_TEN_SECONDS = 10000;
setInterval(updateMessages, MILLISECONDS_IN_TEN_SECONDS);

//EventListener for sendButton
sendButton.addEventListener("click", function(sendButtonClickEvent) {
  sendButtonClickEvent.preventDefault();
  const sender = nameInput.value;
  const message = myMessage.value;

  sendMessages(sender,message);
  myMessage.value = "";
});

//Update messages inside the chatbox
function updateMessagesInChatBox() {
  updateMessages()
}

//API requests to server
function fetchMessages() {
  return fetch(serverURL)
    .then( response => response.json())
}

//Update Messages
async function updateMessages() {
  //Fetch
  const messages = await fetchMessages();

  //Loop over
  let formattedMessages = "";
  messages.forEach(message => {
    formattedMessages += formatMessage(message, nameInput.value);
  });

  //Add to the chatbox
  chatBox.innerHTML = formattedMessages;
}



//Formatting message
function formatMessage(message, myNameInput) {
  const time = new Date(message.timestamp);
  const formattedTime = `${time.getHours()}:${time.getMinutes()}`;

  if (myNameInput === message.sender) {
    return `
    <div class="mine messages">
        <div class="message">
            ${message.text}
        </div>
        <div class="sender-info">
            ${formattedTime}
        </div>
    </div>
    `
  } else {
    return `
    <div class="yours messages">
      <div class="message">
        ${message.text}
      </div>
      <div class="sender-info">
        ${message.sender} ${formattedTime}
      </div>
    </div>
    `
  }
};

//Send Messages
function sendMessages(username, text) {
  const newMessage = {
    sender: username,
    text: text,
    timestamp: new Date()
  }

  fetch (serverURL, {
    method: `POST`,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newMessage)
  });
}