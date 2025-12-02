import React from 'react';
import { AlertCircle, X } from 'lucide-react';

const ErrorMessage = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="error-message">
      <AlertCircle size={20} />
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} className="error-close">
          <X size={18} />
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;