import SocketManager from "./sockets.js";

class ChatInterface {
    constructor(form, output, socket) {

        this.output = output;
        this.form = form;
        this.socket = socket;

        this.addEventListener();

    }

    inputMessage(event) {
        event.preventDefault();

        let input = event.target[0].value;

        console.log(input)

        // sanitize input


    }

    sendMessage(message) {
        this.socket.sendMessage(message);
    }

    addEventListener() {
        this.form.addEventListener('submit', this.inputMessage.bind(this));
    }

    printMessage(string) {
        this.output.innerHTML += string;
    }
}

export default ChatInterface;