import { useContext, useState, useEffect, useRef } from 'react';
import { SocketContext } from '../middleware/SocketProvider';

import '../styles/Support/support.css';
import '../styles/Support/support-online.css';

export default function Support() {
    const { sendMessage, messages, changeRoom, newUsers, supportOnline } = useContext(SocketContext);

    const bottomRef = useRef(null);

    const [room, setRoom] = useState(undefined);

    const Submitter = (event) => {
        event.preventDefault();
        const message = event.target[0].value;
        sendMessage(message);
        event.target.reset();
    };

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behaviour: 'smooth' });
    }, [messages])

    const RoomChanger = (room) => {
        setRoom(room);
        changeRoom(room);
    }

    return <main id="support" className="flex flex-col items-center">
            <div className="flex flex-row flex-wrap">
                <header>
                    <h1>Support Chat</h1>
                    <div id="support-online" className="flex flex-row items-center">
                        <span className={`dot ${supportOnline ? 'green' : 'red'}`}></span>
                        <span>{supportOnline ? 'Support is online!' : 'Support is offline.'}</span>
                    </div>
                </header>

                <section>
                    {newUsers.length > 0 ? newUsers.map((item, key) => {
                        return <div className={`flex flex-col user-selector ${room === item[1].room ? 'highlight' : null}`} onClick={() => RoomChanger(item[1].room)} key={key}>
                            <span>{item[0]}</span>
                            <span>{item[1].role}</span>
                        </div>
                    }) : null}
                </section>

                <section>


                    <ul className="messages">
                        {true ? console.log(messages) : null}
                        {messages.map((msg, index) => (
                            <li key={index}>
                                <strong>{msg.user}:</strong> {msg.message}
                            </li>
                        ))}
                        <li ref={bottomRef} />
                    </ul>

                    <form onSubmit={Submitter}>
                        <input type="text" placeholder="Message" required />
                        <input type="submit" value="Send" />
                    </form>


                </section>

            </div>
        </main>;
}