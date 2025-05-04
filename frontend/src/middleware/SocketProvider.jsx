import { createContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext();

export default function SocketProvider({ children }) {
    const socketRef = useRef();
    const messageHandlerRef = useRef();

    const [messages, setMessages] = useState([]);

    const [auth, setAuth] = useState(false);

    const [users, setUsers] = useState([]);

    const [newUsers, setNewUsers] = useState([]);

    // Store a ref to the latest handler
    messageHandlerRef.current = (rec) => {
        const { user, message } = rec;
        setMessages(prev => [...prev, { user, message }]);
    };

    useEffect(() => {

        if (!auth || socketRef.current) return;

        socketRef.current = io('http://localhost:3000', {
            withCredentials: true
        });

        socketRef.current.on('connect', () => {
            console.log('connected');
        });

        socketRef.current.on('message', (rec) => {
            messageHandlerRef.current?.(rec);
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

    useEffect(() => {
        const doUserLogin = async () => {
            let response = await fetch('http://localhost:3000/user-login', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });
    
            let data = await response.json();

            if (data && data.message) {

                if (data.message === 'is-admin') {
                    return 'is-admin';
                }

                return true;
            }

            return false;
        }

        const loginStatus = async () => {
            const result = await doUserLogin();
            setAuth(result);
        };

        loginStatus();

    }, []);    

    useEffect(() => {
        getUsersCount();
    }, []);

    const getUsersCount = async () => {
        let response = await fetch('http://localhost:3000/getUsersCount', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
        });

        let data = await response.json();

        if (data) {
            setUsers(data.count);
        }
    }

    const changeRoom = (room) => {
        socketRef.current?.emit('change-room', room);
    }

    const sendMessage = (message) => {
        socketRef.current?.emit('message', message);
    };

    return (
        <SocketContext.Provider value={{ sendMessage, messages, changeRoom, users, auth, setNewUsers, newUsers }}>
            {children}
        </SocketContext.Provider>
    );
}
