import { FormEvent, useState } from "react";
import { VscGithubInverted, VscSignOut } from "react-icons/vsc";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import styles from "./styles.module.scss";

export function SendMessageForm() {
  const { user, signOut } = useAuth();
  const [message, setMessage] = useState("");

  async function submitMessage(event: FormEvent) {
    event.preventDefault();

    if (!message.trim()) {
      return;
    }

    await api.post("messages", { message });

    setMessage("");
  }

  return (
    <div className={styles.sendMessageFormWrapper}>
      <button onClick={() => signOut()} className={styles.signOutButton}>
        <VscSignOut size={32} />
      </button>

      <header className={styles.userInformation}>
        <div className={styles.userImage}>
          <img src={user?.avatar_url} alt="Avatar" />
        </div>
        <strong className={styles.userName}>{user?.name}</strong>
        <span className={styles.userGithub}>
          <VscGithubInverted size={16} />
          {user?.login}
        </span>
      </header>

      <form onSubmit={submitMessage} className={styles.sendMessageForm}>
        <label htmlFor="message">Mensagem</label>
        <textarea
          name="message"
          id="message"
          value={message}
          onChange={(ev) => setMessage(ev.target.value)}
          placeholder="Qual sua expectativa para o evento?"
        />
        <button type="submit">Enviar mensagem</button>
      </form>
    </div>
  );
}
