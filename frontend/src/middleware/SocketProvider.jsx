import { createContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext();

export default function SocketProvider({ children }) {
    const socketRef = useRef();
    const messageHandlerRef = useRef();

    const [messages, setMessages] = useState([]);

    // Store a ref to the latest handler
    messageHandlerRef.current = (rec) => {
        const { user, message } = rec;
        setMessages(prev => [...prev, { user, message }]);
    };

    useEffect(() => {

        const jwt = localStorage.getItem('jwt');

        socketRef.current = io('http://localhost:3000', {
            query: { jwt: jwt }
        });

        socketRef.current.on('connect', () => {
            console.log('connected');
        });

        socketRef.current.on('message', (rec) => {
            messageHandlerRef.current?.(rec);
        });

        socketRef.current.on('receive-jwt', (value) => {
            const { jwt } = value;
            localStorage.setItem('jwt', JSON.stringify(jwt));
        });

        socketRef.current.on('auth-error', () => {
            localStorage.removeItem('jwt');
            window.location.reload();
        });

        return () => socketRef.current.disconnect();

    }, []);

    const changeRoom = (room) => {
        socketRef.current?.emit('change-room', room);
    }

    const sendMessage = (message) => {
        socketRef.current?.emit('message', message);
    };

    return (
        <SocketContext.Provider value={{ sendMessage, messages, changeRoom }}>
            {children}
        </SocketContext.Provider>
    );
}
