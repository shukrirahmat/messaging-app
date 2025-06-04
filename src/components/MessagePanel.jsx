import { useState } from "react";
import { useNavigate } from "react-router-dom";
import fetchURL from "../fetchURL.js";
import PropTypes from "prop-types";

const MessagePanel = ({ receiver }) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [sendError, setSendError] = useState("");
  const [isSending, setIsSending] = useState(false);

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

  return (
    <div>
      <form onSubmit={sendMessage}>
        <textarea
          name="message"
          placeholder="Write your message"
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
