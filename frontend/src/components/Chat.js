import SocketManager from '../middleware/sockets.js';
import ChatInterface from '../middleware/ChatInterface.js';

export default function Chat() {
  const container = document.createElement('section');
  container.innerHTML = `
    <header>
      <h2>Chat</h2>
    </header>
    <form id="chatForm">
      <input id="messageInput" type="text" placeholder="Type a message..." />
      <button id="sendBtn" type="submit">Send</button>
    </form>
    <ul id="messages"></ul>
  `;

  // Setup after elements are in the DOM
  requestAnimationFrame(() => {
    const socket = new SocketManager('http://localhost:3000');
    socket.connect();

    const form = container.querySelector('#chatForm');
    const output = container.querySelector('#messages');
    const chat = new ChatInterface(form, output, socket);

    chat.addEventListener();
  });

  return container;
}
