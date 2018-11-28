const socket = io();

const elements = {
  input: document.getElementById('message'),
  button: document.getElementById('button'),
  messages: document.getElementById('messages'),
  online: document.getElementById('online')
};

function sendMessage() {
  const msg = elements.input.value;

  // If no message provided
  if (msg.length === 0) return;

  // Senging a message to server
  socket.emit('sendMsg', msg);

  // Rendering message locally
  renderMessage(msg, ownMessage = true);

  // Clearing input
  elements.input.value = '';
};

function renderMessage(msg, ownMessage = false) {
  const { messages } = elements;
  const html = `<div class="msg ${ownMessage ? 'own' : ''}"><p>${msg}</p></div>`
  messages.insertAdjacentHTML('beforeend', html);
  messages.parentElement.scrollTop = messages.parentElement.scrollHeight;
};

function renderOnline(online) {
  elements.online.innerHTML = online;
};

socket.on('newMsg', renderMessage);
socket.on('online', renderOnline);

// Adding event listeners
elements.button.addEventListener('click', sendMessage);
document.addEventListener('keypress', (e) => {
  if (e.key === "Enter") { sendMessage() }
});