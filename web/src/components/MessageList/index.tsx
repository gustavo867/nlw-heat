import { useEffect, useState } from "react";
import io from "socket.io-client";

import styles from "./styles.module.scss";

import logoImg from "../../assets/logo.svg";
import { api } from "../../services/api";

export interface User {
  id: string;
  name: string;
  github_id: number;
  avatar_url: string;
  login: string;
}

export interface Message {
  id: string;
  text: string;
  created_at: Date;
  user_id: string;
  user: User;
}

const messagesQueue: Message[] = [];

const socket = io("http://localhost:4000");

socket.on("new_message", (newMessage: Message) => {
  messagesQueue.push(newMessage);
});

export function MessageList() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (messagesQueue.length > 0) {
        setMessages((s) => [messagesQueue[0], s[0], s[1]].filter(Boolean));
        messagesQueue.shift();
      }
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function getMessages() {
      const res = await api.get<Message[]>("messages/last3");

      setMessages(res.data);
    }

    getMessages();
  }, []);

  return (
    <div className={styles.messageListWrapper}>
      <img src={logoImg} alt="DoWhile 2021" />

      <ul className={styles.messageList}>
        {messages.map((message) => (
          <li
            className={styles.message}
            key={`${message.id}-${message.created_at}`}
          >
            <p className={styles.messageContent}>{message.text}</p>
            <div className={styles.messageUser}>
              <div className={styles.userImage}>
                <img src={message.user.avatar_url} alt="Gustavo Santana" />
              </div>
              <span>{message.user.name}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
