import React from 'react';
import { CheckCircle, X } from 'lucide-react';

const SuccessMessage = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="success-message">
      <CheckCircle size={20} />
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} className="success-close">
          <X size={18} />
        </button>
      )}
    </div>
  );
};

export default SuccessMessage;