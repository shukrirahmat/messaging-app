import { useState, useEffect, Fragment, useRef } from "react";
import { useNavigate } from "react-router-dom";
import fetchURL from "../fetchURL.js";
import PropTypes from "prop-types";
import { format, isSameDay } from "date-fns";
import styles from "../styles/MessagePanel.module.css";

const MessagePanel = ({ sender, receiver }) => {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const [message, setMessage] = useState("");
  const [sendError, setSendError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isLoadingMessage, setIsLoadingMessage] = useState(true);
  const [LoadingMessageErr, setLoadingMessageErr] = useState(false);
  const [messageList, setMessageList] = useState([]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const editMessage = (e) => {
    const newMessage = e.target.value;
    setMessage(newMessage);
  };

  const sendMessage = (e) => {
    e.preventDefault();

    const token = window.localStorage.getItem("token");

    if (!token) {
      navigate(0);
    } else if (!message) {
      //do nothing
    } else {
      setIsSending(true);
      fetch(fetchURL + "/message", {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
        },
        body: new URLSearchParams({
          receiver,
          content: message,
        }),
      })
        .then((res) => {
          if (res.status === 401) {
            throw new Error("Unverifed");
          } else if (!res.ok) {
            throw new Error("Server error");
          }
          return res.json();
        })
        .then((data) => {
          setMessage("");
          setSendError("");
          setIsSending(false);
          const newList = messageList.slice();
          newList.push(data);
          setMessageList(newList);
        })
        .catch((err) => {
          if (err.message === "Unverified") {
            navigate(0);
          } else {
            setSendError(err.message);
            setIsSending(false);
          }
        });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messageList]);

  useEffect(() => {
    setIsLoadingMessage(true);
    setLoadingMessageErr("");
    const token = window.localStorage.getItem("token");

    if (!token) {
      navigate(0);
    } else {
      fetch(fetchURL + "/message/chat", {
        mode: "cors",
        method: "post",
        headers: {
          "Content-type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
        },
        body: new URLSearchParams({
          user: receiver,
        }),
      })
        .then((response) => {
          if (response.ok) return response.json();
          else if (response.status === 401)
            throw new Error("Verification fail");
          else throw new Error("Failed to fetch messages");
        })
        .then((data) => {
          setMessageList(data);
          setIsLoadingMessage(false);
        })
        .catch((err) => {
          if (err.message === "Verification fail") {
            navigate(0);
          } else {
            setLoadingMessageErr(err.message);
            setIsLoadingMessage(false);
          }
        });
    }
  }, [receiver]);

  return (
    <div className={styles.base}>
      <div className={styles.chatContainer}>
        {isLoadingMessage ? (
          <p>Loading messages...</p>
        ) : LoadingMessageErr ? (
          <p>{LoadingMessageErr}</p>
        ) : messageList.length < 1 ? (
          <p>No messages yet. Say "Hello!" to {receiver}</p>
        ) : (
          <div className={styles.chatList}>
            {messageList.map((msg, index) => {
              let css = `${styles.chatMsg} ${styles.leftMsg}`;
              let name = msg.senderName;

              if (msg.senderName === sender) {
                css = `${styles.chatMsg} ${styles.rightMsg}`;
                name = "You";
              }

              return (
                <Fragment key={msg.id}>
                  {(index == 0 ||
                    !isSameDay(
                      msg.dateSend,
                      messageList[index - 1].dateSend
                    )) && (
                    <p className={styles.dateGap}>
                      {format(msg.dateSend, "P")}
                    </p>
                  )}
                  <div className={css} key={msg.id}>
                    <p className={styles.chatName}>{name}</p>
                    <p className={styles.chatBody}>{msg.content}</p>
                    <p className={styles.chatDate}>
                      {format(msg.dateSend, "p")}
                    </p>
                  </div>
                </Fragment>
              );
            })}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage}>
        <textarea
          name="message"
          placeholder={`Write your message to @${receiver}`}
          value={message}
          onChange={editMessage}
        />
        <button disabled={isSending}>SEND</button>
        {sendError && <p>{sendError}</p>}
      </form>
    </div>
  );
};

MessagePanel.propTypes = {
  sender: PropTypes.string,
  receiver: PropTypes.string,
};

export default MessagePanel;
