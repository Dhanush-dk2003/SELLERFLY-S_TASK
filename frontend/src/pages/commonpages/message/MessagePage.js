import React, { useState } from "react";
import Snackbar from "../../../components/Snackbar";
import MessageCard from "./MessageCard";
import ComposeMessage from "./ComposeMessage";
import Sidebar from "../Sidebar";
import { useMediaQuery } from "react-responsive";
import { useEffect } from "react";
import {
  fetchInboxMessages,
  sendMessage,
  deleteMessage,
  updateMessageStatus,
} from "./messagesapi";

const MessagePage = () => {
  const [showCompose, setShowCompose] = useState(false);
  const [messages, setMessages] = useState([]); // Start empty, no sample data

  const [snackbar, setSnackbar] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const isLargeScreen = useMediaQuery({ minWidth: 992 });

  const showSnackbar = (message, type = "success") => {
    setSnackbar({ show: true, message, type });
  };
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const data = await fetchInboxMessages();
        setMessages(data);
      } catch (err) {
        showSnackbar("Failed to load messages", "error");
      }
    };
    loadMessages();
  }, []);
  const handleDelete = async (id) => {
    try {
      await deleteMessage(id);
      setMessages(messages.filter((msg) => msg.id !== id));
      showSnackbar("Message deleted", "success");
    } catch (err) {
      showSnackbar("Failed to delete message", "error");
    }
  };

  const handleSend = async (newMsg) => {
    try {
      const savedMsg = await sendMessage(newMsg);
      setMessages([savedMsg, ...messages]);
      setShowCompose(false);
      showSnackbar("Message sent", "success");
    } catch (err) {
      showSnackbar("Failed to send message", "error");
    }
  };
  const handleCancel = () => {
    setShowCompose(false);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateMessageStatus(id, newStatus);
      setMessages(
        messages.map((msg) =>
          msg._id === id ? { ...msg, status: newStatus } : msg
        )
      );
      showSnackbar(
        `Message ${newStatus}`,
        newStatus === "Accepted" ? "success" : "warning"
      );
    } catch {
      showSnackbar("Failed to update message", "error");
    }
  };

  return (
    <div className="d-flex flex-column flex-md-row">
      <Sidebar />
      <div
        className="flex-grow-1 px-3 py-4 mb-4 mt-4"
        style={{
          marginLeft: isLargeScreen ? "250px" : "0",
          marginRight: isLargeScreen ? "50px" : "0",
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
          <h4 className="mb-0">Manager’s Message box</h4>
          <button
            className="btn btn-outline-dark mt-2 mt-md-0 d-flex align-items-center"
            onClick={() => setShowCompose(true)}
          >
            <span role="img" aria-label="compose">
              ✏️
            </span>
            <span className="ms-2 d-none d-md-inline">Compose</span>
          </button>
        </div>

        {showCompose ? (
          <ComposeMessage onCancel={handleCancel} onSend={handleSend} />
        ) : messages.length === 0 ? (
          <p className="text-muted mt-4">No messages available.</p>
        ) : (
          messages.map((msg) => (
            <MessageCard
              key={msg.id}
              message={msg}
              onDelete={() => handleDelete(msg.id)}
              onStatusChange={(status) => handleStatusChange(msg.id, status)}
            />
          ))
        )}
      </div>

      <Snackbar
        message={snackbar.message}
        show={snackbar.show}
        type={snackbar.type}
        onClose={() => setSnackbar((prev) => ({ ...prev, show: false }))}
      />
    </div>
  );
};

export default MessagePage;
