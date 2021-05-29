import { Avatar, IconButton } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import "./style.css";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import InsertEmoticonRoundedIcon from "@material-ui/icons/InsertEmoticonRounded";
import SendIcon from "@material-ui/icons/Send";
import MicIcon from "@material-ui/icons/Mic";
import AttachFileRoundedIcon from "@material-ui/icons/AttachFileRounded";
import Message from "../Message";
import Pusher from "pusher-js";
import axios from "../../axios";

function Chat() {
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    axios.get("/api/v1/messages/sync").then((response) => {
      setMessages(response.data);
    });
  }, []);

  useEffect(() => {
    var pusher = new Pusher("85ec96e085234d39ff47", {
      cluster: "ap1",
    });

    const channel = pusher.subscribe("messages");
    channel.bind("inserted", (newMessage) => {
      setMessages([...messages, newMessage]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [messages]);

  console.log(messages);

  const sendMessage = async (event) => {
    event.preventDefault();
    
    if (messageInput.trim().length > 0) {
      axios.post('/api/v1/messages/new', {
        message: messageInput.trim(),
        name: "Ayan",
        timestamp: new Date().toUTCString(),
        sent: true,
      })
      setMessageInput('')
    }

  };

  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar />

        <div className="chat__header__info">
          <h3>Room name</h3>
          <p>Last seen at...</p>
        </div>

        <div className="chat__header__right">
          <IconButton>
            <SearchOutlinedIcon />
          </IconButton>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>

      <div className="chat__body">
        {messages?.map(({ message, name, timestamp, sent }) => (
          <Message
            roomName={name}
            message={message}
            timestamp={timestamp}
            className={sent ? "sent" : ""}
          />
        ))}

        {/* <Message
          roomName="Ayan"
          message="This is a message"
          timestamp={new Date().toUTCString()}
        />
        <Message
          className="sent"
          roomName="Ayan"
          message="This is a message"
          timestamp={new Date().toUTCString()}
        />
        <Message
          roomName="Ayan"
          message="This is a message"
          timestamp={new Date().toUTCString()}
        /> */}
      </div>

      <div className="chat__inputContainer">
        <InsertEmoticonRoundedIcon />
        <AttachFileRoundedIcon />
        <form onSubmit={sendMessage}>
          <input
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            type="text"
            placeholder="Type a message"
          />
          {messageInput.length === 0 ? (
            <MicIcon />
          ) : (
            <button type="submit">
              <SendIcon />
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

export default Chat;
