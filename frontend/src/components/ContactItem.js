import React, { useState } from 'react';
import './ContactItem.css';

const ContactItem = ({ contact, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${contact.name}?`)) {
      setIsDeleting(true);
      try {
        await onDelete(contact.id);
      } catch (error) {
        console.error('Error deleting contact:', error);
        alert('Failed to delete contact. Please try again.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="contact-item">
      <div className="contact-info">
        <h3>{contact.name}</h3>
        {contact.email && <p>Email: {contact.email}</p>}
        {contact.phone && <p>Phone: {contact.phone}</p>}
      </div>
      <button 
        onClick={handleDelete} 
        disabled={isDeleting}
        className="delete-btn"
      >
        {isDeleting ? 'Deleting...' : 'Delete'}
      </button>
    </div>
  );
};

export default ContactItem;
