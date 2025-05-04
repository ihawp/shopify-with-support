import { useContext, useState, useEffect } from 'react';
import { SocketContext } from '../middleware/SocketProvider';

export default function Support() {
    const { sendMessage, messages, changeRoom } = useContext(SocketContext);

    const [users, setUsers] = useState([]);

    const Submitter = (event) => {
        event.preventDefault();
        const message = event.target[0].value;
        sendMessage(message);
        event.target.reset();
    };

    const UserFetcher = async () => {

        const jwt = localStorage.getItem('jwt');

        let response = await fetch('http://localhost:3000/getUsers', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`,
            },
        });

        let data = await response.json();

        if (data) {
            setUsers(data);
        }

    }

    const RoomChanger = (room) => {
        console.log(room);
        changeRoom(room);
    }

    useEffect(() => {

        UserFetcher();

    }, []);

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

            {users.length > 0 ?
            <section>
                <table>
                    <thead>
                        <tr>
                            <th>
                                First
                            </th>
                            <th>
                                Second
                            </th>
                            <th>
                                Third
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((item, key) => {
                            return <tr>
                            <td>wow</td>
                                <td>{key}</td>
                                <td>{item[0]}</td>
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
