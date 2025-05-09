import { useContext, useState, useEffect, useRef } from 'react';
import { SocketContext } from '../middleware/SocketProvider';

import '../styles/Support/support.css';
import '../styles/Support/support-online.css';
import '../styles/Support/user-selector.css';

export default function Support() {
    const { sendMessage, messages, changeRoom, newUsers, supportOnline, isTyping, stopTyping, userTyping } = useContext(SocketContext);

    const bottomRef = useRef(null);
    const messageRef = useRef(null);

    const [alreadyTyping, setAlreadyTyping] = useState(false);
    const [room, setRoom] = useState(undefined);

    const Submitter = (event) => {
        event.preventDefault();
        sendMessage(messageRef.current.value);
        resetMessageInput();
        sendTyping(false);
        setAlreadyTyping(false);
        event.target.reset();
    };

    const resetMessageInput = () => {
        messageRef.current.value = '';
    }

    const sendTyping = (bool) => {
        if (bool) return isTyping();
        stopTyping();
    }

    const doTyping = (event) => {
        // limit sending of signals because rate limiting
        if (event.target.value.length > 0 && !alreadyTyping) {
            setAlreadyTyping(true);
            return isTyping();
        }
        if (event.target.value.length === 0) {
            setAlreadyTyping(false);
            stopTyping();
        }
    }

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behaviour: 'smooth' });
    }, [messages]);

    const RoomChanger = (room) => {
        resetMessageInput();
        sendTyping(false);
        setRoom(room);
        changeRoom(room);
    }

    return <main id="support" className="flex flex-col items-center">
            <div className="flex flex-row flex-wrap">
                <header id="support-online">
                    <h1>Support Chat</h1>
                    <div className="flex flex-row items-center">
                        <span className={`dot ${supportOnline ? 'green' : 'red'}`}></span>
                        <span>{supportOnline ? 'Support is online!' : 'Support is offline.'}</span>
                    </div>
                </header>

                <div id="user-selector">
                    {newUsers.length > 0 ? newUsers.map((item, key) => {
                        return <div className={`flex flex-col user-selector ${room === item[1].room ? 'highlight' : null}`} onClick={() => RoomChanger(item[1].room)} key={key}>
                            <p>{item[0]}</p>
                            <p>{item[1].role}</p>
                            <p>{item[1].unread}</p>
                        </div>
                    }) : null}
                </div>

                <section>


                    <ul className="messages">
                        {messages.map((msg, index) => (
                            <li key={index}>
                                <strong>{msg.user}:</strong> {msg.message}
                            </li>
                        ))}
                        <li ref={bottomRef} />
                    </ul>

                    <div>
                        {userTyping.map((item, key) => {
                             return item.val ? <p key={key}>{item.name} is typing.</p> : null;
                        })}
                    </div>

                    <form onSubmit={Submitter}>
                        <input ref={messageRef} type="text" placeholder="Message" onChange={doTyping} required />
                        <input type="submit" value="Send" />
                    </form>


                </section>

            </div>
        </main>;
}