import { useContext, useState, useEffect, useRef } from 'react';
import { SocketContext } from '../middleware/SocketProvider';

import '../styles/Support/support.css';
import '../styles/Support/header.css';
import '../styles/Support/section.css';
import MeetSupportTeam from '../components/MeetSupportTeam';

import Hero from '../components/Hero';

export default function Support() {
    const { sendMessage, messages, changeRoom, newUsers, supportOnline, isTyping, stopTyping, userTyping, auth, users } = useContext(SocketContext);

    const bottomRef = useRef(null);
    const messageRef = useRef(null);

    const [alreadyTyping, setAlreadyTyping] = useState(false);
    const [room, setRoom] = useState(undefined);
    const [roomName, setRoomName] = useState(undefined);
    const [inputLength, setInputLength] = useState(0);

    const Submitter = (event) => {
        event.preventDefault();
        sendMessage(messageRef.current.value);
        resetMessageInput();
        sendTyping(false);
        setAlreadyTyping(false);
        setInputLength(0);
        event.target.reset();
        messageRef.current.focus();
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
        setInputLength(event.target.value.length);
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
        if (bottomRef.current && bottomRef.current.scrollIntoView) {
          bottomRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'nearest',
          });
        }
      }, [messages]);

    const RoomChanger = (room, name) => {
        resetMessageInput();
        sendTyping(false);
        setRoom(room);
        setRoomName(name);
        changeRoom(room);
        setInputLength(0);
    }

    return <main id="support" className="flex flex-col items-center">
            <Hero leftIdentity='support-hero' backgroundClass={'background-2'} title='Support' subtitle='Need some help?' description='We are here to help you we care a lot so please let us know if you need anything.' hashLinks={[{to: '#support-online', title: "Get Support Now"}]} links={[{to: '/', title: "Shop"}]} />
            <div className="flex flex-row flex-wrap">
                <header id="support-online" className="flex flex-row">
                    {auth === 'is-admin' ? <div className="header-is-admin flex flex-row items-center">
                        {newUsers.length > 0 ? <div className="flex flex-row items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192l42.7 0c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0L21.3 320C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7l42.7 0C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3l-213.3 0zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352l117.3 0C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7l-330.7 0c-14.7 0-26.7-11.9-26.7-26.7z"/></svg>
                            <span>{users}</span>
                        </div> : null}
                        <div className="flex flex-row items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M208 352c114.9 0 208-78.8 208-176S322.9 0 208 0S0 78.8 0 176c0 38.6 14.7 74.3 39.6 103.4c-3.5 9.4-8.7 17.7-14.2 24.7c-4.8 6.2-9.7 11-13.3 14.3c-1.8 1.6-3.3 2.9-4.3 3.7c-.5 .4-.9 .7-1.1 .8l-.2 .2s0 0 0 0s0 0 0 0C1 327.2-1.4 334.4 .8 340.9S9.1 352 16 352c21.8 0 43.8-5.6 62.1-12.5c9.2-3.5 17.8-7.4 25.2-11.4C134.1 343.3 169.8 352 208 352zM448 176c0 112.3-99.1 196.9-216.5 207C255.8 457.4 336.4 512 432 512c38.2 0 73.9-8.7 104.7-23.9c7.5 4 16 7.9 25.2 11.4c18.3 6.9 40.3 12.5 62.1 12.5c6.9 0 13.1-4.5 15.2-11.1c2.1-6.6-.2-13.8-5.8-17.9c0 0 0 0 0 0s0 0 0 0l-.2-.2c-.2-.2-.6-.4-1.1-.8c-1-.8-2.5-2-4.3-3.7c-3.6-3.3-8.5-8.1-13.3-14.3c-5.5-7-10.7-15.4-14.2-24.7c24.9-29 39.6-64.7 39.6-103.4c0-92.8-84.9-168.9-192.6-175.5c.4 5.1 .6 10.3 .6 15.5z"/></svg>
                            <span><strong>{roomName || 'No Room Selected'}</strong></span>
                        </div>
                    </div> : null}
                    <div className="flex flex-row items-center bubble">
                        <span className={`dot ${supportOnline ? 'green' : 'red'}`}></span>
                        <span>{supportOnline ? 'Support is online!' : 'Support is offline.'}</span>
                    </div>
                </header>

                <section id="support-chat" className="flex flex-row">

                    {newUsers.length > 0 ? <div id="user-selector" className="flex flex-col">
                        {newUsers.map((item, key) => {
                            return <div className={`flex flex-row gap-1 user-selector ${room === item[1].room ? 'highlight' : null}`} onClick={() => RoomChanger(item[1].room, item[0])} key={key}>
                                <div className="flex flex-col">
                                    <span>{item[0]}</span>
                                    <span className="fs-0-9">{item[1].role}</span>
                                </div>
                                <span className="flex flex-row items-center justify-center">{item[1].unread}</span>
                            </div>
                        })}
                    </div> : null}

                    <div id="chat">
                        <ul className="messages">
                            {messages.map((msg, index) => {
                                const showUser = index === 0 || messages[index - 1].user !== msg.user;
                                return <li key={index} className="flex flex-col">
                                    {showUser && <span className="username fs-1">{msg.user}</span>}
                                    <span className="message">{msg.message}</span>
                                </li>
                            })}
                            <li ref={bottomRef} />
                        </ul>

                        <div className='is-typing flex flex-row justify-between'>
                            <div>
                                {userTyping.map((item, key) => {
                                    return <span key={key}>{key > 0 ? ',' : null} {item.name} is typing{userTyping.length === 1 ? '.' : null }</span>;
                                })}
                            </div>
                            {inputLength ? <span>{inputLength}/255</span> : null}
                        </div>

                        <form id="message-form" onSubmit={Submitter} className='flex flex-row gap-1'>
                            <label htmlFor="message-chat-box">Send a Message:</label>
                            <input id="message-chat-box" className="p-0-75" ref={messageRef} type="text" placeholder="Message" onChange={doTyping} maxLength="255" required />
                            <button type="submit" className="flex flex-row items-center p-0-75">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480l0-83.6c0-4 1.5-7.8 4.2-10.8L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z"/></svg>
                                <span className="send-text">Send</span>
                            </button>
                        </form>
                    </div>

                </section>

            </div>
            <MeetSupportTeam />
        </main>;
}