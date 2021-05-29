import React from "react";
import "./style.css";

function Message({ roomName, className, message, timestamp }) {
  return (
    <p className={"chat__message " + className}>
      {className !== "sent" && <sp className="chat__name">{roomName}</sp>}
      {message}
      <span className="chat__timestamp">{timestamp}</span>
    </p>
  );
}

export default Message;
