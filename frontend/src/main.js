import Home from "./pages/home.js";

import SocketManager from './middleware/sockets.js';

const app = document.getElementById('main');

const manager = new SocketManager('http://localhost:3000');

manager.connect();

// router for SPA

let location = getLocation();

function getLocation() {
    return window.location.pathname;
}

function setLocation() {
    location = getLocation();
}

function Link(to) {
    window.location = to;
    Main();
}

function Main() {

    switch (location) {
        case '/':
            app.innerHTML = Home();
            break;
        case '/chat':
            app.innerHTML = Chat();
            break;
    }

}

function Chat() {
    return `
        <section>
            
        </section>
    `;
}

Main();