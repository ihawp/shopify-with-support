import { createContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext();

export default function SocketProvider({ children }) {
    const socketRef = useRef();
    const messageHandlerRef = useRef();

    const [messages, setMessages] = useState([]);
    const [auth, setAuth] = useState(null);

    const [users, setUsers] = useState([]);
    const [newUsers, setNewUsers] = useState([]);

    messageHandlerRef.current = (rec) => {
        const { user, message } = rec;
        setMessages(prev => [...prev, { user, message }]);
    };

    useEffect(() => {
        const doUserLogin = async () => {
            try {
                const response = await fetch('http://localhost:3000/user-login', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                if (!response.ok) throw new Error('Auth failed');

                const data = await response.json();

                const result = data?.message === 'is-admin' ? 'is-admin' : true;

                setAuth(result);
            } catch {
                setAuth(false);
            }
        };

        doUserLogin();
    }, []);

    useEffect(() => {
        if (!auth || socketRef.current) return;

        socketRef.current = io('http://localhost:3000', {
            withCredentials: true,
        });

        socketRef.current.on('connect', () => {
            console.log('connected');
        });

        socketRef.current.on('message', (rec) => {
            messageHandlerRef.current?.(rec);
        });

        socketRef.current.on('past-messages', (messages) => {
            console.log(messages)
        });

        socketRef.current.on('auth-error', (message) => {
            console.log(message);
        });

        socketRef.current.on('user-join', (userCount) => {
            setUsers(userCount);
        });

        socketRef.current.on('user-leave', (userCount) => {
            setUsers(userCount);
        });

        socketRef.current.on('update-users', (data) => {
            if (auth === 'is-admin') {
                setNewUsers(data);
            }
        });

        return () => socketRef.current.disconnect();
    }, [auth]);

    const changeRoom = (room) => {
        socketRef.current?.emit('change-room', room);
    };

    const sendMessage = (message) => {
        socketRef.current?.emit('message', message);
    };

    return (
        <SocketContext.Provider value={{ sendMessage, messages, changeRoom, users, auth, setNewUsers, newUsers }}>
            {children}
        </SocketContext.Provider>
    );
}
