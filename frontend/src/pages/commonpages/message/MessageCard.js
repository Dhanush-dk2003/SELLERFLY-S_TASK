import React from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const MessageCard = ({ message, onDelete, onStatusChange }) => {
  const handleAccept = () => onStatusChange('Accepted');
  const handleDeny = () => onStatusChange('Denied');

  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body position-relative">
        <button
          className="btn-close position-absolute top-0 end-0 m-2"
          onClick={onDelete}
          aria-label="Close"
        ></button>

        <h6 className="text-muted">Message from: {message.from}</h6>
        <p>{message.content}</p>
        <p className="text-muted small">{message.timeRange}</p>

        {message.status ? (
          <span className={`badge ${message.status === 'Accepted' ? 'bg-success' : 'bg-danger'}`}>
            {message.status}
          </span>
        ) : (
          <div className="d-flex gap-2 justify-content-end">
            <button className="btn btn-outline-success btn-sm" onClick={handleAccept}>
              <FaCheckCircle className="me-1" /> Accept
            </button>
            <button className="btn btn-outline-danger btn-sm" onClick={handleDeny}>
              <FaTimesCircle className="me-1" /> Deny
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageCard;
