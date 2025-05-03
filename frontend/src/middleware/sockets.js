import { io, Socket } from 'socket.io-client';

class SocketManager {
  constructor(url) {
    this.socket = io(url); // Initialize socket connection
  }

  // Connect to the socket and set up event listeners
  connect() {
    this.socket.on('connect', () => {
      console.log(`Connected: ${this.socket.id}`);
    });

    this.socket.on('message', (msg) => {
      console.log('New message received:', msg);
      this.handleNewMessage(msg);
    });
  }

  // Send a message to the server
  sendMessage(message) {
    if (message.trim()) {
      this.socket.emit('message', message);
      console.log(`Message sent: ${message}`);
    }
  }

  // Handle received messages and update the UI
  handleNewMessage(msg) {
    const messagesList = document.querySelector('#messages');
    const li = document.createElement('li');
    li.textContent = msg;
    messagesList.appendChild(li);
  }

  // Optional: Disconnect from the server when needed
  disconnect() {
    this.socket.disconnect();
    console.log('Disconnected');
  }
}

export default SocketManager;