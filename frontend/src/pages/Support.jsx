import { useContext, useState, useEffect } from 'react';
import { SocketContext } from '../middleware/SocketProvider';

export default function Support() {
    const { sendMessage, messages, changeRoom, newUsers } = useContext(SocketContext);

    const [room, setRoom] = useState(undefined);

    const Submitter = (event) => {
        event.preventDefault();
        const message = event.target[0].value;
        sendMessage(message);
        event.target.reset();
    };

    const RoomChanger = (room) => {
        setRoom(room);
        changeRoom(room);
    }

    return <main>
            <header>
                <h1>Support page</h1>
            </header>

            <section>
                <form onSubmit={Submitter}>
                    <input type="text" placeholder="Message" required />
                    <input type="submit" value="Send" />
                </form>
            </section>

            {newUsers.length > 0 ?
            <section>
                <h2>{room}</h2>
                <table>
                    <thead>
                        <tr>
                            <th>
                                Socket
                            </th>
                            <th>
                                Role
                            </th>
                            <th>
                                Chat Now
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {newUsers.map((item, key) => {
                            return <tr key={key}>
                                <td>{item[0]}</td>
                                <td>{item[1].role}</td>
                                <td><button onClick={() => RoomChanger(item[1].room)}>Chat</button></td>
                            </tr>
                        })}
                    </tbody>
                </table>
                <form>

                </form>
            </section> : null }
            <section>
                <h2>Messages:</h2>
                <ul>
                    {messages.map((msg, index) => (
                        <li key={index}>
                            <strong>{msg.user || 'Anonymous'}:</strong> {msg.message}
                        </li>
                    ))}
                </ul>
            </section>
        </main>;
}