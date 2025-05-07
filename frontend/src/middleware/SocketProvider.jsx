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

    const [supportOnline, setSupportOnline] = useState(false);

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

        socketRef.current.on('connect', () => { });

        socketRef.current.on('message', (rec) => {
            messageHandlerRef.current?.(rec);
        });

        socketRef.current.on('admin-online', (value) => {
            const { message } = value;
            setSupportOnline(message);
        });

        socketRef.current.on('update-unread-counts', (rec) => {
            console.log(rec);
        });

        socketRef.current.on('past-messages', ({ messages }) => {
            setMessages(messages);
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


        // errors

        socketRef.current.on('auth-error', (rec) => {
            console.log(rec);
        });

        socketRef.current.on('error', (rec) => {
            const { type, message } = rec;

            console.log(type, message);
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
        <SocketContext.Provider value={{ sendMessage, messages, changeRoom, users, auth, setNewUsers, newUsers, supportOnline }}>
            {children}
        </SocketContext.Provider>
    );
}